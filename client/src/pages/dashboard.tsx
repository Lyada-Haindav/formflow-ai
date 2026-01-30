import { useState } from "react";
import { useForms, useCreateForm, useGenerateFormAI, useCreateCompleteForm } from "@/hooks/use-forms";
import { Link, useLocation } from "wouter";
import { 
  Plus, 
  MoreVertical, 
  FileText, 
  BarChart2, 
  Calendar, 
  Sparkles, 
  Loader2,
  Trash2
} from "lucide-react";
import { LayoutShell } from "@/components/layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: forms, isLoading } = useForms();
  const [_, setLocation] = useLocation();

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </LayoutShell>
    );
  }

  const activeForms = forms?.filter(f => f.isPublished).length || 0;
  const totalForms = forms?.length || 0;
  // Mock total submissions calculation for now
  const totalSubmissions = 124; 

  return (
    <LayoutShell>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your forms and view performance.</p>
          </div>
          <CreateFormDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Forms" value={totalForms} icon={<FileText className="text-blue-500" />} />
          <StatCard title="Active Forms" value={activeForms} icon={<Sparkles className="text-amber-500" />} />
          <StatCard title="Total Responses" value={totalSubmissions} icon={<BarChart2 className="text-emerald-500" />} />
        </div>

        {/* Forms List */}
        <div>
          <h2 className="text-xl font-bold font-display mb-4">Your Forms</h2>
          {forms && forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
              <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No forms yet</h3>
              <p className="text-muted-foreground mb-6">Create your first form to get started</p>
              <CreateFormDialog />
            </div>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-muted/50">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold font-display">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FormCard({ form }: { form: any }) {
  const [_, setLocation] = useLocation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col hover:border-primary/50 transition-colors group">
        <CardHeader className="flex-1">
          <div className="flex justify-between items-start">
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${form.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
              {form.isPublished ? 'Published' : 'Draft'}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocation(`/builder/${form.id}`)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation(`/forms/${form.id}/submissions`)}>Submissions</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`/forms/${form.id}`, '_blank')}>View Public</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="mt-4 font-display truncate">{form.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2">
            {form.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t border-border/50 pt-4 mt-auto">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(form.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <BarChart2 className="w-3 h-3" />
              0 responses
            </div>
          </div>
          <Button 
            className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground shadow-none" 
            onClick={() => setLocation(`/builder/${form.id}`)}
          >
            Edit Form
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CreateFormDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scratch' | 'ai'>('ai');
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [_, setLocation] = useLocation();

  const createMutation = useCreateForm();
  const generateMutation = useGenerateFormAI();
  const createCompleteMutation = useCreateCompleteForm();

  const handleCreate = async () => {
    if (activeTab === 'scratch') {
      const res = await createMutation.mutateAsync({ title: title || "New Form", description: "" });
      setOpen(false);
      setLocation(`/builder/${res.id}`);
    } else {
      const generated = await generateMutation.mutateAsync(prompt);
      const form = await createCompleteMutation.mutateAsync({
        title: generated.title,
        description: generated.description,
        steps: generated.steps || []
      });
      setOpen(false);
      setLocation(`/builder/${form.id}`);
    }
  };

  const isPending = createMutation.isPending || generateMutation.isPending || createCompleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" />
          Create New Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Create a new form</DialogTitle>
          <DialogDescription>
            Choose how you want to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${activeTab === 'ai' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
            onClick={() => setActiveTab('ai')}
          >
            <div className="p-2 bg-purple-100 rounded-lg w-fit text-purple-600 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Generate with AI</h3>
            <p className="text-sm text-muted-foreground mt-1">Describe your form and let AI build the structure for you.</p>
          </div>
          
          <div 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${activeTab === 'scratch' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
            onClick={() => setActiveTab('scratch')}
          >
            <div className="p-2 bg-blue-100 rounded-lg w-fit text-blue-600 mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Start from Scratch</h3>
            <p className="text-sm text-muted-foreground mt-1">Build your form manually field by field using the editor.</p>
          </div>
        </div>

        {activeTab === 'ai' ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">What kind of form do you need?</label>
              <Textarea 
                placeholder="e.g. A job application form for a senior react developer with sections for personal info, experience, and GitHub profile." 
                className="h-32 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Form Title</label>
              <Input 
                placeholder="e.g. Contact Form" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleCreate} disabled={isPending} className="w-full sm:w-auto">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {activeTab === 'ai' ? 'Generate Form' : 'Create Form'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
