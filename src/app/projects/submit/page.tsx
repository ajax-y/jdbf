"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Github, Upload, Rocket, Layout, Globe, Code2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmitProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => router.push("/projects"), 2000);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-xl p-6"
          >
            <Card className="max-w-md w-full border-none shadow-[0_50px_100px_rgba(0,0,0,0.15)] rounded-[4rem] text-center p-12 space-y-8">
               <div className="h-24 w-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 size={48} />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tight text-slate-950">Successfully Deployed</h2>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed">Your project node has been synchronized with the global gallery repository.</p>
               </div>
               <div className="pt-4">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">Redirecting to Gallery...</Badge>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 leading-none">
          Share your <span className="text-primary italic underline decoration-8 decoration-primary/10">Vision.</span>
        </h1>
        <p className="text-slate-500 mt-6 text-xl font-bold max-w-2xl">
          Upload your latest breakthrough to the campus project gallery. Earn merit points and industry visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3.5rem]">
             <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                <CardTitle className="text-3xl font-black text-slate-950 tracking-tight">Project Node Configuration</CardTitle>
                <CardDescription className="font-bold text-base text-slate-500">Define the engineering parameters of your creation</CardDescription>
             </CardHeader>
             <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Project Identifier</Label>
                    <Input placeholder="e.g. AI-Powered Campus Map" className="h-14 rounded-2xl bg-slate-50/50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Value Proposition (Tagline)</Label>
                    <Input placeholder="Describe the core impact in one sentence" className="h-14 rounded-2xl bg-slate-50/50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">GitHub Endpoint</Label>
                      <div className="relative group">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input placeholder="github.com/repo-link" className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Live Manifest (Optional)</Label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input placeholder="https://live-app.demo" className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Architecture Overview</Label>
                    <Textarea 
                      placeholder="Explain features, tech stack, and engineering choices..." 
                      className="min-h-[180px] rounded-[2.5rem] bg-slate-50/50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all p-8" 
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 bg-primary text-white hover:bg-primary/90 transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                         <Rocket size={20} />
                       </motion.div>
                    ) : (
                      <>
                        <Rocket size={20} />
                        Deploy to Gallery Hub
                      </>
                    )}
                  </Button>
                </form>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3.5rem] p-10 overflow-hidden relative group">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 relative z-10">
                <Sparkles className="text-primary" />
                Submission Protocol
              </h3>
              <ul className="space-y-6 relative z-10">
                 {[
                   "Synchronize a professional README",
                   "Specify core tech stacks correctly",
                   "Enable public repository access",
                   "Tag for appropriate hub channels"
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-4 text-sm font-bold text-slate-400 leading-relaxed group/li">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 group-hover/li:scale-150 transition-transform" />
                      {tip}
                   </li>
                 ))}
              </ul>
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Code2 size={250} />
              </div>
           </Card>

           <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden border border-slate-50 group hover:border-primary/20 transition-all duration-500">
              <div className="h-40 w-full bg-slate-50 flex items-center justify-center p-8">
                 <div className="h-full w-full border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                    <Layout size={32} className="text-slate-200 group-hover:text-primary/20 transition-colors" />
                 </div>
              </div>
              <CardHeader className="p-8">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Preview</p>
                 <CardTitle className="text-xl font-black mt-2 text-slate-900 group-hover:text-primary transition-colors">Elite Card Manifestation</CardTitle>
                 <div className="flex items-center gap-2 mt-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Signal</span>
                 </div>
              </CardHeader>
           </Card>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>;
}
