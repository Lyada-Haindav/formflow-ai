import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerAudioRoutes, speechToText, ensureCompatibleFormat } from "./replit_integrations/audio";
import { GoogleGenAI } from "@google/genai";
import express from 'express';

// Gemini AI client using Replit AI Integrations (no API key needed)
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});
import { db } from "./db";
import { templates } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Register Audio Routes (for voice input features)
  registerAudioRoutes(app);

  // Forms
  app.get(api.forms.list.path, isAuthenticated, async (req: any, res) => {
    const forms = await storage.getForms(req.user.claims.sub);
    res.json(forms);
  });

  app.get(api.forms.get.path, async (req, res) => {
    // Public access allowed for viewing form structure (e.g. to fill it out)
    const form = await storage.getForm(Number(req.params.id));
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  });

  app.post(api.forms.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.forms.create.input.parse(req.body);
      const form = await storage.createForm({ ...input, userId: req.user.claims.sub });
      res.status(201).json(form);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json(err.errors);
      else throw err;
    }
  });

  app.put(api.forms.update.path, isAuthenticated, async (req: any, res) => {
    // Ideally check ownership
    const updated = await storage.updateForm(Number(req.params.id), req.body);
    res.json(updated);
  });

  app.delete(api.forms.delete.path, isAuthenticated, async (req: any, res) => {
    // Ideally check ownership
    await storage.deleteForm(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.forms.publish.path, isAuthenticated, async (req: any, res) => {
    const updated = await storage.updateForm(Number(req.params.id), { isPublished: true });
    res.json(updated);
  });

  // Steps
  app.post(api.steps.create.path, isAuthenticated, async (req, res) => {
    const formId = Number(req.params.formId);
    // Auto-calculate order index
    const existingSteps = await storage.getSteps(formId);
    const orderIndex = existingSteps.length;
    
    const input = api.steps.create.input.parse(req.body);
    const step = await storage.createStep({ ...input, formId, orderIndex });
    res.status(201).json(step);
  });

  app.put(api.steps.update.path, isAuthenticated, async (req, res) => {
    const updated = await storage.updateStep(Number(req.params.id), req.body);
    res.json(updated);
  });

  app.delete(api.steps.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteStep(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.steps.reorder.path, isAuthenticated, async (req, res) => {
    const { steps } = req.body;
    for (const s of steps) {
      await storage.updateStep(s.id, { orderIndex: s.orderIndex });
    }
    res.sendStatus(200);
  });

  // Fields
  app.post(api.fields.create.path, isAuthenticated, async (req, res) => {
    const stepId = Number(req.params.stepId);
    const existingFields = await storage.getFields(stepId);
    const orderIndex = existingFields.length;

    const input = api.fields.create.input.parse(req.body);
    const field = await storage.createField({ ...input, stepId, orderIndex });
    res.status(201).json(field);
  });

  app.put(api.fields.update.path, isAuthenticated, async (req, res) => {
    const updated = await storage.updateField(Number(req.params.id), req.body);
    res.json(updated);
  });

  app.delete(api.fields.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteField(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.fields.reorder.path, isAuthenticated, async (req, res) => {
    const { fields } = req.body;
    for (const f of fields) {
      await storage.updateField(f.id, { orderIndex: f.orderIndex });
    }
    res.sendStatus(200);
  });

  // Submissions
  app.post(api.submissions.create.path, async (req, res) => {
    // Public endpoint
    const formId = Number(req.params.formId);
    const submission = await storage.createSubmission(formId, req.body.data);
    res.status(201).json(submission);
  });

  app.get(api.submissions.list.path, isAuthenticated, async (req, res) => {
    const submissions = await storage.getSubmissions(Number(req.params.formId));
    res.json(submissions);
  });

  // AI Generation using Gemini
  app.post(api.ai.generateForm.path, isAuthenticated, async (req, res) => {
    const { prompt } = req.body;

    try {
      const systemPrompt = `You are an expert form builder. Generate a JSON structure for a multi-step form based on the user's prompt. 
            Response format:
            {
              "title": "Form Title",
              "description": "Form Description",
              "steps": [
                {
                  "title": "Step Title",
                  "description": "Step Description",
                  "fields": [
                    {
                      "type": "text" | "number" | "select" | "checkbox" | "radio" | "textarea" | "date",
                      "label": "Field Label",
                      "placeholder": "Placeholder",
                      "required": boolean,
                      "options": [{ "label": "Option 1", "value": "opt1" }] (only for select/radio)
                    }
                  ]
                }
              ]
            }
            Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nUser request: ${prompt}` }] }
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const generated = JSON.parse(text);
      res.json(generated);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ message: "Failed to generate form" });
    }
  });

  // Transcribe Endpoint (Simple helper for frontend voice input)
  app.post("/api/transcribe", express.json({ limit: "50mb" }), async (req, res) => {
    try {
      const { audio } = req.body;
      if (!audio) return res.status(400).json({ error: "No audio provided" });

      const rawBuffer = Buffer.from(audio, "base64");
      const { buffer, format } = await ensureCompatibleFormat(rawBuffer);
      const text = await speechToText(buffer, format);
      res.json({ text });
    } catch (error) {
      console.error("Transcription error:", error);
      res.status(500).json({ error: "Transcription failed" });
    }
  });

  // Seed Templates if empty
  (async () => {
    const existingTemplates = await db.select().from(templates);
    if (existingTemplates.length === 0) {
      console.log("Seeding templates...");
      await db.insert(templates).values([
        {
          name: "Contact Form",
          description: "Simple contact form for websites.",
          icon: "Mail",
          category: "Business",
          config: {
            title: "Contact Us",
            description: "We would love to hear from you.",
            steps: [
              {
                title: "Your Details",
                description: "Let us know who you are.",
                fields: [
                  { type: "text", label: "Name", required: true, orderIndex: 0 },
                  { type: "text", label: "Email", required: true, orderIndex: 1 },
                  { type: "textarea", label: "Message", required: true, orderIndex: 2 }
                ]
              }
            ]
          }
        },
        {
          name: "Job Application",
          description: "Standard job application form.",
          icon: "Briefcase",
          category: "HR",
          config: {
            title: "Job Application",
            description: "Apply for our open positions.",
            steps: [
              {
                title: "Personal Info",
                description: "Basic information.",
                fields: [
                  { type: "text", label: "Full Name", required: true, orderIndex: 0 },
                  { type: "text", label: "Email", required: true, orderIndex: 1 },
                  { type: "text", label: "Phone", required: true, orderIndex: 2 }
                ]
              },
              {
                title: "Experience",
                description: "Tell us about your work history.",
                fields: [
                  { type: "textarea", label: "Resume / Cover Letter", required: true, orderIndex: 0 },
                  { type: "text", label: "LinkedIn Profile", required: false, orderIndex: 1 }
                ]
              }
            ]
          }
        },
        {
          name: "Event Registration",
          description: "Register attendees for an event.",
          icon: "Calendar",
          category: "Events",
          config: {
            title: "Event Registration",
            description: "Join us for our upcoming event.",
            steps: [
              {
                title: "Attendee Info",
                description: "Who is coming?",
                fields: [
                  { type: "text", label: "Name", required: true, orderIndex: 0 },
                  { type: "text", label: "Email", required: true, orderIndex: 1 },
                  { type: "select", label: "Ticket Type", required: true, orderIndex: 2, options: [{ label: "General Admission", value: "general" }, { label: "VIP", value: "vip" }] }
                ]
              }
            ]
          }
        }
      ]);
      console.log("Templates seeded.");
    }
  })();

  return httpServer;
}
