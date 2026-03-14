"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Query profiles for match (check both full_name and username)
      const { data: profile, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.eq."${userId}",username.eq."${userId}"`)
        .eq('password', password)
        .maybeSingle();

      if (dbError || !profile) {
        throw new Error("Invalid Credentials. Access Denied.");
      }

      // Set session cookie based on user ID and role
      const role = profile.role;
      document.cookie = `gfg_session=${profile.id}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `gfg_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push(role === 'admin' ? "/admin" : "/dashboard");
      router.refresh();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #e2e8f0 1.5px, transparent 0)`, backgroundSize: '48px 48px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] z-10 flex flex-col items-center text-center"
      >
            <div className="h-56 w-56 relative mb-8">
               <motion.div 
                 animate={{ 
                   y: [0, -15, 0],
                   rotate: [0, 5, -5, 0]
                 }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="w-full h-full flex items-center justify-center relative z-10"
               >
                   <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GfG Logo" className="w-40 h-40 object-contain drop-shadow-[0_25px_50px_rgba(47,141,70,0.2)]" />
                </motion.div>
                {/* Vector Sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute text-primary/30"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      zIndex: 0
                    }}
                  >
                    <Sparkles size={20 + Math.random() * 24} />
                  </motion.div>
                ))}
             </div>
             <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-3 uppercase">Club Hub</h1>
             <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em] mb-12">Authorized Node Access</p>
        

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 sm:p-14 rounded-[4rem] border border-slate-200/60 shadow-[0_40px_100px_rgba(0,0,0,0.06)] relative overflow-hidden group w-full"
        >
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-primary group-hover:h-[6px] transition-all" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 text-destructive text-xs font-bold mb-8"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Ident-ID / Username" 
                      className="h-16 rounded-[1.8rem] pl-16 bg-slate-50 border-slate-100 focus:border-primary/20 focus:bg-white font-bold text-slate-900 transition-all outline-none ring-0 placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Security Token" 
                      className="h-16 rounded-[1.8rem] pl-16 bg-slate-50 border-slate-100 focus:border-primary/20 focus:bg-white font-bold text-slate-900 transition-all outline-none ring-0 placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                 <label className="flex items-center gap-2 cursor-pointer group/check">
                    <div className="h-5 w-5 rounded-lg border-2 border-white/10 flex items-center justify-center p-1 group-hover/check:border-primary/50 transition-colors">
                       <div className="h-full w-full bg-primary rounded-[2px] opacity-0 group-hover/check:opacity-20" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto-Recall</span>
                 </label>
                 <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">D-Sync Request?</button>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-24 rounded-[3rem] font-black text-xs uppercase tracking-[0.4em] bg-primary hover:bg-[#256e36] text-white shadow-[0_30px_60px_rgba(47,141,70,0.3)] transition-all hover:scale-[1.02] active:scale-95 border-none relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                {isLoading ? ( <Loader2 className="h-7 w-7 animate-spin" /> ) : (
                  "Initiate Handshake"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
        
        <p className="mt-12 text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          Designed by <span className="text-slate-400">Vector Matrix</span> • Powered by <span className="text-primary italic">GeeksforGeeks</span>
        </p>
      </motion.div>
    </div>
  );
}
