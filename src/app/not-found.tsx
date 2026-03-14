"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveLeft, ShieldAlert, Cpu, Globe, Rocket, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center space-y-12">
        <div className="relative inline-block">
          {/* Main 404 Text with Glitch Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12rem] md:text-[20rem] font-black tracking-tighter text-slate-950 leading-none select-none relative"
          >
            404
            {/* Glitch Overlay 1 */}
            <motion.span
              animate={{
                x: [-2, 2, -1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-0 text-primary translate-x-2 translate-y-1 opacity-50 blur-sm pointer-events-none"
            >
              404
            </motion.span>
            {/* Glitch Overlay 2 */}
            <motion.span
              animate={{
                x: [2, -2, 1, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
              className="absolute inset-0 text-blue-500 -translate-x-2 -translate-y-1 opacity-30 blur-sm pointer-events-none"
            >
              404
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-white/20 backdrop-blur-3xl rounded-full border border-white/30 flex items-center justify-center shadow-2xl"
          >
            <div className="h-24 w-24 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-12 animate-bounce">
              <ShieldAlert size={48} strokeWidth={2.5} />
            </div>
          </motion.div>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Signal Interrupted
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight"
          >
            Node <span className="text-primary italic underline decoration-8 decoration-primary/10">Not Found.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed"
          >
            The session identifier you're looking for has been decommissioned or moved to a restricted sector. Verify your connection protocol and try again.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/">
            <Button className="h-16 rounded-[2.5rem] px-12 font-black text-xs uppercase tracking-widest gap-3 bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              <MoveLeft size={18} strokeWidth={3} />
              Return to Hub
            </Button>
          </Link>
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 border border-slate-100 animate-pulse">
              <Cpu size={20} />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 border border-slate-100 animate-pulse [animation-delay:0.2s]">
              <Globe size={20} />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 border border-slate-100 animate-pulse [animation-delay:0.4s]">
              <Rocket size={20} />
            </div>
          </div>
        </motion.div>

        {/* Binary Stream Decoration */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden lg:flex flex-col gap-4">
           {[1,0,1,1,0].map((b, i) => (
             <motion.span 
               key={i}
               animate={{ opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
               className="text-[10px] font-black text-primary/20"
             >
               {b}
             </motion.span>
           ))}
        </div>
      </div>
    </div>
  );
}
