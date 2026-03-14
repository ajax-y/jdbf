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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0b14]">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #22c55e 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
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
                  <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GfG Logo" className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]" />
               </motion.div>
               {/* Vector Sparkles */}
               {[...Array(6)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{ 
                     scale: [1, 1.5, 1],
                     opacity: [0.3, 0.8, 0.3],
                     rotate: [0, 45, 0]
                   }}
                   transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                   className="absolute text-primary"
                   style={{
                     top: `${Math.random() * 100}%`,
                     left: `${Math.random() * 100}%`,
                     zIndex: 0
                   }}
                 >
                   <Sparkles size={16 + Math.random() * 20} />
                 </motion.div>
               ))}
            </div>
            <h1 className="text-3xl font-black tracking-widest text-white mb-2">GFG PORTAL</h1>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Vector Authorized Access</p>
        

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1c2c]/60 backdrop-blur-2xl p-8 sm:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group mt-10 w-full"
        >
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
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
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Ident-ID / Username" 
                      className="h-16 rounded-[1.8rem] pl-14 bg-white/5 border-white/5 focus:border-primary/30 focus:bg-white/[0.08] font-bold text-white transition-all outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access Token" 
                      className="h-16 rounded-[1.8rem] pl-14 bg-white/5 border-white/5 focus:border-primary/30 focus:bg-white/[0.08] font-bold text-white transition-all outline-none"
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
                className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] bg-primary hover:bg-primary/90 text-white shadow-[0_30px_60px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.02] active:scale-95 border-none relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                {isLoading ? ( <Loader2 className="h-6 w-6 animate-spin" /> ) : (
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
