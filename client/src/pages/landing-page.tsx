import { Link } from "wouter";
import { ArrowRight, CheckCircle2, LayoutTemplate, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">FormAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Button asChild variant="default" className="rounded-full px-6">
                <a href="/api/login">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in-fade" style={{ animationDelay: '0ms' }}>
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Now with AI Generation
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-in-fade" style={{ animationDelay: '100ms' }}>
              Build beautiful forms <br />
              <span className="gradient-text">in seconds, not hours.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in-fade" style={{ animationDelay: '200ms' }}>
              Create stunning forms with our AI-powered builder. Drag, drop, and customize to match your brand perfectly. Collect data and analyze results instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in-fade" style={{ animationDelay: '300ms' }}>
              <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <a href="/api/login">
                  Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 py-6">
                <a href="#demo">View Live Demo</a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground animate-in-fade" style={{ animationDelay: '400ms' }}>
              No credit card required · Free plan available
            </p>
          </div>
        </div>

        {/* Hero Image Mockup */}
        <div className="mt-20 relative max-w-6xl mx-auto px-4 animate-in-fade" style={{ animationDelay: '500ms' }}>
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur shadow-2xl overflow-hidden premium-shadow">
            <div className="h-10 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            {/* Abstract UI Representation */}
            <div className="p-8 grid grid-cols-12 gap-8 min-h-[500px] bg-background">
              <div className="col-span-3 border-r border-border pr-6 hidden md:block space-y-4">
                <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted/50 rounded animate-pulse" />
                <div className="space-y-3 mt-8">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-10 w-full bg-muted/30 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="col-span-12 md:col-span-9 space-y-6">
                <div className="h-12 w-1/3 bg-muted rounded-lg animate-pulse" />
                <div className="space-y-4 p-6 border border-border rounded-xl border-dashed">
                  <div className="h-6 w-1/4 bg-muted/60 rounded" />
                  <div className="h-12 w-full bg-muted/20 rounded border border-border" />
                  <div className="flex gap-4 mt-4">
                    <div className="h-10 w-32 bg-primary/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features packed into a simple, intuitive interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="AI Generation"
              description="Describe your form in plain English and watch our AI build it instantly. No manual field creation needed."
            />
            <FeatureCard 
              icon={<LayoutTemplate className="w-8 h-8 text-blue-500" />}
              title="Drag & Drop Builder"
              description="Intuitive visual editor lets you arrange fields, add pages, and customize layouts with ease."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
              title="Secure & Reliable"
              description="Enterprise-grade security with built-in spam protection and data encryption at rest."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} FormAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
      <div className="mb-6 p-3 bg-muted/50 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
