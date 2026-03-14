"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Lock, ArrowRight, AlertCircle } from "lucide-react";
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
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="flex flex-col items-center mb-10">
           <div className="h-24 w-24 rounded-[2.5rem] bg-white flex items-center justify-center p-3 shadow-2xl border-2 border-primary/20 mb-6 group relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <img src="/logo.png" alt="GfG Logo" className="w-full h-full object-contain relative z-10" />
           </div>
           <h1 className="text-4xl font-black tracking-tighter text-slate-950">GFG PORTAL</h1>
        </div>

        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-slate-100">
          <CardHeader className="p-10 pb-0 text-center">
            <CardTitle className="text-3xl font-black text-slate-950">Member Access</CardTitle>
            <CardDescription className="text-base font-bold text-slate-500 mt-2">Enter credentials to unlock the hub</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold mb-6"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-slate-900">Username</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Username" 
                      className="h-16 rounded-2xl pl-12 bg-slate-50 border-none font-bold text-lg text-slate-900"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-slate-900">Security Key</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="h-16 rounded-2xl pl-12 bg-slate-50 border-none font-bold text-lg text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 group"
              >
                {isLoading ? ( <Loader2 className="h-5 w-5 animate-spin" /> ) : (
                  <span className="flex items-center gap-2">Authorize Session <ArrowRight size={18} /></span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
