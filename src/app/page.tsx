"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
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
        <div className="flex flex-col items-center mb-8">
           <div className="h-16 w-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-primary-foreground font-black text-3xl shadow-xl shadow-primary/30 mb-4">
             G
           </div>
           <h1 className="text-3xl font-black tracking-tighter text-center">GFG CLUB PORTAL</h1>
           <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Innovate · Create · Elevate</p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0 text-center">
            <CardTitle className="text-2xl font-black">Welcome Back</CardTitle>
            <CardDescription className="text-sm font-medium">Enter your credentials to access the hub</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Campus Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="name@rit.edu" 
                      className="h-14 rounded-2xl pl-12 bg-muted/30 border-none focus-visible:ring-primary/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Password</Label>
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="h-14 rounded-2xl pl-12 bg-muted/30 border-none focus-visible:ring-primary/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/10" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-[#fafafa] px-4 text-muted-foreground">OR CONTINUE WITH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl border-none bg-muted/30 hover:bg-muted/50 font-black text-[10px] uppercase tracking-widest">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl border-none bg-muted/30 hover:bg-muted/50 font-black text-[10px] uppercase tracking-widest">
                  Google
                </Button>
              </div>
            </form>

            <p className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-8">
              Authorized Campus Access Only
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
