import { db } from "./db";
import { forms, formSteps, formFields, submissions, templates, type InsertForm, type InsertStep, type InsertField, type Form, type Step, type Field, type Submission, type Template } from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Forms
  getForms(userId: string): Promise<Form[]>;
  getForm(id: number): Promise<(Form & { steps: (Step & { fields: Field[] })[] }) | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form>;
  deleteForm(id: number): Promise<void>;
  
  // Steps
  createStep(step: InsertStep): Promise<Step>;
  updateStep(id: number, step: Partial<InsertStep>): Promise<Step>;
  deleteStep(id: number): Promise<void>;
  getSteps(formId: number): Promise<Step[]>;
  
  // Fields
  createField(field: InsertField): Promise<Field>;
  updateField(id: number, field: Partial<InsertField>): Promise<Field>;
  deleteField(id: number): Promise<void>;
  getFields(stepId: number): Promise<Field[]>;
  
  // Submissions
  createSubmission(formId: number, data: any): Promise<Submission>;
  getSubmissions(formId: number): Promise<Submission[]>;
}

export class DatabaseStorage implements IStorage {
  async getForms(userId: string): Promise<Form[]> {
    return await db.select().from(forms).where(eq(forms.userId, userId)).orderBy(desc(forms.createdAt));
  }

  async getForm(id: number): Promise<(Form & { steps: (Step & { fields: Field[] })[] }) | undefined> {
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, id),
      with: {
        steps: {
          orderBy: asc(formSteps.orderIndex),
          with: {
            fields: {
              orderBy: asc(formFields.orderIndex),
            },
          },
        },
      },
    });
    return form;
  }

  async createForm(form: InsertForm): Promise<Form> {
    const [newForm] = await db.insert(forms).values(form).returning();
    return newForm;
  }

  async updateForm(id: number, form: Partial<InsertForm>): Promise<Form> {
    const [updated] = await db.update(forms).set(form).where(eq(forms.id, id)).returning();
    return updated;
  }

  async deleteForm(id: number): Promise<void> {
    await db.delete(forms).where(eq(forms.id, id));
  }

  async createStep(step: InsertStep): Promise<Step> {
    const [newStep] = await db.insert(formSteps).values(step).returning();
    return newStep;
  }

  async updateStep(id: number, step: Partial<InsertStep>): Promise<Step> {
    const [updated] = await db.update(formSteps).set(step).where(eq(formSteps.id, id)).returning();
    return updated;
  }

  async deleteStep(id: number): Promise<void> {
    await db.delete(formSteps).where(eq(formSteps.id, id));
  }

  async getSteps(formId: number): Promise<Step[]> {
    return await db.select().from(formSteps).where(eq(formSteps.formId, formId)).orderBy(asc(formSteps.orderIndex));
  }

  async createField(field: InsertField): Promise<Field> {
    const [newField] = await db.insert(formFields).values(field).returning();
    return newField;
  }

  async updateField(id: number, field: Partial<InsertField>): Promise<Field> {
    const [updated] = await db.update(formFields).set(field).where(eq(formFields.id, id)).returning();
    return updated;
  }

  async deleteField(id: number): Promise<void> {
    await db.delete(formFields).where(eq(formFields.id, id));
  }

  async getFields(stepId: number): Promise<Field[]> {
    return await db.select().from(formFields).where(eq(formFields.stepId, stepId)).orderBy(asc(formFields.orderIndex));
  }

  async createSubmission(formId: number, data: any): Promise<Submission> {
    const [submission] = await db.insert(submissions).values({ formId, data }).returning();
    return submission;
  }

  async getSubmissions(formId: number): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.formId, formId)).orderBy(desc(submissions.submittedAt));
  }
}

export const storage = new DatabaseStorage();
