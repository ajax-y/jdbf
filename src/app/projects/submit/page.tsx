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
import { supabase } from "@/lib/supabase";

export default function SubmitProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_url: "",
    live_url: "",
    tech_stack: ""
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
      if (!userId) throw new Error("No active session found.");

      const { error } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          description: formData.description,
          github_url: formData.github_url,
          live_url: formData.live_url,
          tech_stack: formData.tech_stack.split(',').map(s => s.trim()),
          owner_id: userId
        }]);

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => router.push("/projects"), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to submit node.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b14]/90 backdrop-blur-2xl p-6"
          >
            <Card className="max-w-md w-full border border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.6)] rounded-[4rem] text-center p-12 sm:p-16 space-y-10 bg-[#1a1c2c]/80">
               <div className="h-32 w-32 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)] relative">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  <CheckCircle2 size={64} strokeWidth={2.5} />
               </div>
               <div className="space-y-6">
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-none">Successfully Deployed</h2>
                  <p className="text-slate-400 font-bold text-lg leading-relaxed uppercase tracking-[0.1em]">Your project node has been synchronized with the global gallery repository.</p>
               </div>
               <div className="pt-6">
                  <Badge className="bg-primary/20 text-primary border border-primary/20 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em]">Redirecting to Gallery...</Badge>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-16">
        <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none">
          Share your <span className="text-primary italic underline underline-offset-[12px] decoration-primary/20">Vision.</span>
        </h1>
        <p className="text-slate-500 mt-10 text-lg sm:text-xl font-bold max-w-2xl uppercase tracking-widest leading-relaxed">
          Upload your latest breakthrough to the campus project gallery. Earn merit points and industry visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3.5rem] border border-slate-100">
             <CardHeader className="bg-slate-50/50 p-10 sm:p-12 border-b border-slate-100">
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Project Node Configuration</CardTitle>
                <CardDescription className="font-bold text-xs text-slate-400 uppercase tracking-[0.2em]">Define the engineering parameters of your creation</CardDescription>
             </CardHeader>
             <CardContent className="p-10 sm:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Project Identifier</Label>
                    <Input 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. AI-Powered Campus Map" 
                      className="h-16 rounded-[1.3rem] bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/30 transition-all text-slate-900 pl-8 shadow-sm" 
                      required 
                    />
                  </div>
 
                   <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Tech Stack (comma separated)</Label>
                     <Input 
                       value={formData.tech_stack}
                       onChange={e => setFormData({...formData, tech_stack: e.target.value})}
                       placeholder="e.g. Next.js, Supabase, Tailwind" 
                       className="h-16 rounded-[1.3rem] bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/30 transition-all text-slate-900 pl-8 shadow-sm" 
                       required 
                     />
                   </div>
 
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">GitHub Endpoint</Label>
                        <div className="relative group">
                          <Github className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            value={formData.github_url}
                            onChange={e => setFormData({...formData, github_url: e.target.value})}
                            placeholder="github.com/repo-link" 
                            className="h-16 rounded-[1.3rem] pl-16 bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/30 transition-all text-slate-900 shadow-sm" 
                            required 
                          />
                        </div>
                      </div>
                     <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Live Manifest (Optional)</Label>
                       <div className="relative group">
                         <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                         <Input 
                           value={formData.live_url}
                           onChange={e => setFormData({...formData, live_url: e.target.value})}
                           placeholder="https://live-app.demo" 
                           className="h-16 rounded-[1.3rem] pl-16 bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/30 transition-all text-slate-900 shadow-sm" 
                         />
                       </div>
                     </div>
                   </div>
 
                   <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Architecture Overview</Label>
                     <Textarea 
                       value={formData.description}
                       onChange={e => setFormData({...formData, description: e.target.value})}
                       placeholder="Explain features, tech stack, and engineering choices..." 
                       className="min-h-[220px] rounded-[2.5rem] bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/30 transition-all p-10 text-slate-900 shadow-sm" 
                       required
                     />
                   </div>
 
                   <Button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] gap-4 shadow-2xl shadow-primary/20 bg-primary text-white hover:bg-primary border-none hover:scale-[1.02] active:scale-95 transition-all mt-6"
                   >
                     {isLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Rocket size={24} />
                        </motion.div>
                     ) : (
                       <>
                         <Rocket size={24} />
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

            <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.03)] bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 group hover:border-primary/20 transition-all duration-500">
               <div className="h-48 w-full bg-slate-50 flex items-center justify-center p-10">
                  <div className="h-full w-full border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center">
                     <Layout size={40} className="text-slate-100 group-hover:text-primary/10 transition-colors" />
                  </div>
               </div>
               <CardHeader className="p-10 bg-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Node Preview</p>
                  <CardTitle className="text-2xl font-black mt-3 text-slate-900 group-hover:text-primary transition-colors leading-none tracking-tighter">Elite Card Manifestation</CardTitle>
                  <div className="flex items-center gap-3 mt-6">
                     <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Awaiting Signal</span>
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
