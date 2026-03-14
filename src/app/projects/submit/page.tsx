"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Upload, Rocket, Layout, Globe, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmitProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/projects");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter">
          Share your <span className="text-primary">Vision.</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upload your latest breakthrough to the campus project gallery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl bg-card overflow-hidden">
             <CardHeader className="bg-muted/10 p-8 border-b border-border/10">
                <CardTitle className="text-2xl font-black">Project Details</CardTitle>
                <CardDescription>Define your creation for the community</CardDescription>
             </CardHeader>
             <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Project Name</Label>
                    <Input placeholder="e.g. AI-Powered Campus Map" className="h-12 rounded-xl" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Short Tagline</Label>
                    <Input placeholder="One sentence pitch" className="h-12 rounded-xl" required />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">GitHub Repository</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="github.com/..." className="h-12 rounded-xl pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Live Demo (Optional)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://..." className="h-12 rounded-xl pl-10" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Full Description</Label>
                    <Textarea 
                      placeholder="Explain features, tech stack, and why you built it..." 
                      className="min-h-[150px] rounded-xl" 
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                  >
                    {isLoading ? "Publishing..." : (
                      <>
                        <Rocket size={18} />
                        Publish to Gallery
                      </>
                    )}
                  </Button>
                </form>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-xl bg-primary/5 border border-primary/10 p-8">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Code2 className="text-primary" />
                Quick Tips
              </h3>
              <ul className="space-y-4">
                 {[
                   "Include a clean README in your GitHub",
                   "Mention the tech stack (React, Python, etc.)",
                   "Upload a high-quality cover image",
                   "Tag your project appropriately"
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-xs font-medium text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {tip}
                   </li>
                 ))}
              </ul>
           </Card>

           <Card className="border-none shadow-xl bg-card overflow-hidden">
              <div className="h-32 w-full bg-muted/30 flex items-center justify-center">
                 <Layout size={40} className="text-muted-foreground/20" />
              </div>
              <CardHeader className="p-6">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Preview Mode</p>
                 <CardTitle className="text-xl font-black mt-1">Your project card will look like this</CardTitle>
              </CardHeader>
           </Card>
        </div>
      </div>
    </div>
  );
}
