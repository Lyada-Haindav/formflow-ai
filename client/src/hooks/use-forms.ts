import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateFormRequest, type UpdateFormRequest } from "@shared/routes";
import { type Form, type FormWithStepsAndFields } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useForms() {
  return useQuery({
    queryKey: [api.forms.list.path],
    queryFn: async () => {
      const res = await fetch(api.forms.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch forms");
      return api.forms.list.responses[200].parse(await res.json());
    },
  });
}

export function useForm(id: number) {
  return useQuery({
    queryKey: [api.forms.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.forms.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch form");
      return api.forms.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateFormRequest) => {
      const res = await fetch(api.forms.create.path, {
        method: api.forms.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.forms.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create form");
      }
      return api.forms.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.forms.list.path] });
      toast({ title: "Form created", description: "Your new form is ready to edit." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateFormRequest) => {
      const url = buildUrl(api.forms.update.path, { id });
      const res = await fetch(url, {
        method: api.forms.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update form");
      return api.forms.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.forms.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.forms.get.path, data.id] });
      toast({ title: "Changes saved", description: "Form updated successfully." });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.forms.delete.path, { id });
      const res = await fetch(url, { method: api.forms.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete form");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.forms.list.path] });
      toast({ title: "Form deleted", description: "The form has been permanently removed." });
    },
  });
}

export function usePublishForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.forms.publish.path, { id });
      const res = await fetch(url, { method: api.forms.publish.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to publish form");
      return api.forms.publish.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.forms.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.forms.get.path, data.id] });
      toast({ title: "Form Published!", description: "Your form is now live and accepting submissions." });
    },
  });
}

export function useGenerateFormAI() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch(api.ai.generateForm.path, {
        method: api.ai.generateForm.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("AI Generation failed");
      return api.ai.generateForm.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    }
  });
}
