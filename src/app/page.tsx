"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Role-based redirection logic
    setTimeout(() => {
      setIsLoading(false);
      if (userId.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#fafafa]">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="flex flex-col items-center mb-8 text-slate-900">
           <div className="h-20 w-20 rounded-[1.75rem] bg-primary flex items-center justify-center text-primary-foreground font-black text-4xl shadow-2xl shadow-primary/30 mb-4">
             G
           </div>
           <h1 className="text-4xl font-black tracking-tighter text-center">GFG CLUB PORTAL</h1>
           <p className="text-slate-500 font-black uppercase tracking-[0.25em] text-[11px] mt-1">Innovate · Create · Elevate</p>
        </div>

        <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.08)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-0 text-center">
            <CardTitle className="text-3xl font-black text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-base font-bold text-slate-500">Authorized members login here</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-slate-900">User ID</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      placeholder="Enter your User ID" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="h-16 rounded-2xl pl-12 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300 placeholder:font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-slate-900">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="h-16 rounded-2xl pl-12 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300 placeholder:font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 transition-all group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <>
                    Launch Hub
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-2 mt-10">
               <div className="h-1 w-12 bg-slate-100 rounded-full mb-2" />
               <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Official Campus Node
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
