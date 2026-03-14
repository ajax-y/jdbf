"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen -mt-4 -mx-4 md:-mx-8">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Animated Background Primitives */}
        <div className="absolute inset-0 z-0">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 90, 0],
               opacity: [0.3, 0.5, 0.3]
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"
           />
           <motion.div 
             animate={{ 
               scale: [1.2, 1, 1.2],
               rotate: [0, -90, 0],
               opacity: [0.2, 0.4, 0.2]
             }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"
           />
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em]">The Central Digital Hub</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8"
          >
            GEEKS FOR <br />
            <span className="text-primary italic">GEEKS.</span> <br />
            <span className="text-muted-foreground/30">RIT CAMPUS</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12 text-balance"
          >
            Empowering the next generation of campus innovators through code, community, and collaboration.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button asChild className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 group">
              <Link href="/dashboard">
                Enter Portal
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest border-2 hover:bg-muted/50">
              <Link href="/leaderboard">
                View Leaderboard
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 md:px-24 bg-muted/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
           {[
             { title: "Live Events", desc: "Real-time attendance wall and QR verified check-ins.", icon: Zap },
             { title: "Project Gallery", desc: "Showcase your innovations and collaborate with peers.", icon: Code },
             { title: "Member Tiers", desc: "Earn points, rank up, and unlock exclusive club perks.", icon: Target },
             { title: "Secure Admin", desc: "Powerful tools for event management and analytics.", icon: ShieldCheck }
           ].map((feat, i) => (
             <motion.div 
               key={feat.title}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="p-10 rounded-[2.5rem] bg-card shadow-xl hover:-translate-y-2 transition-transform duration-500 group"
             >
                <div className="h-16 w-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                   <feat.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{feat.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      <footer className="py-20 border-t border-border/10 text-center">
         <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-2xl mx-auto mb-8">
           G
         </div>
         <p className="text-sm font-black uppercase tracking-[0.5em] text-muted-foreground/50">
           Innovate · Create · Elevate
         </p>
      </footer>
    </div>
  );
}
