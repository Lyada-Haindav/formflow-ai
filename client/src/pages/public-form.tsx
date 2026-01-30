import { useParams, useLocation } from "wouter";
import { useForm } from "@/hooks/use-forms";
import { useSubmitForm } from "@/hooks/use-submissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm as useReactForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { VoiceInput } from "@/components/voice-input";

export default function PublicForm() {
  const { id } = useParams();
  const formId = parseInt(id || "0");
  const { data: form, isLoading } = useForm(formId);
  const submit = useSubmitForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useReactForm();

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!form) return <div className="h-screen flex items-center justify-center text-muted-foreground">Form not found or unpublished.</div>;

  const totalSteps = form.steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const step = form.steps[currentStep];

  const onNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (isLastStep) {
        // Handle final submission
        handleSubmit(async (data) => {
          await submit.mutateAsync({ formId, data });
          setSubmitted(true);
        })();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Thank you!</h1>
          <p className="text-muted-foreground">Your response has been recorded successfully.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full bg-white border-b border-gray-200">
        <div className="h-1 bg-primary/10 w-full">
          <motion.div 
            className="h-full bg-primary" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-6 py-4">
           <h1 className="font-bold text-xl">{form.title}</h1>
        </div>
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-display mb-2">{step.title}</h2>
                  {step.description && <p className="text-muted-foreground">{step.description}</p>}
                </div>

                <div className="space-y-6">
                  {step.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-base font-medium">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      <div className="flex gap-2">
                        {field.type === 'text' || field.type === 'email' ? (
                          <div className="relative flex-1">
                            <Input 
                              {...register(`field_${field.id}`, { required: field.required })}
                              placeholder={field.placeholder || "Your answer..."}
                              className="bg-gray-50/50"
                            />
                            {/* Voice Input Integration */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                               <VoiceInput onTranscript={(text) => setValue(`field_${field.id}`, text)} className="h-8 w-8" />
                            </div>
                          </div>
                        ) : field.type === 'textarea' ? (
                          <textarea 
                            {...register(`field_${field.id}`, { required: field.required })}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        ) : (
                          <Input {...register(`field_${field.id}`)} />
                        )}
                      </div>
                      
                      {errors[`field_${field.id}`] && (
                        <p className="text-sm text-red-500">This field is required</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
            disabled={currentStep === 0}
            className={currentStep === 0 ? "invisible" : ""}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <Button onClick={onNext} size="lg" className="px-8" disabled={submit.isPending}>
            {submit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLastStep ? "Submit" : "Next"} {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </main>
    </div>
  );
}
