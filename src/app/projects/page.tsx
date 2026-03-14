"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Code2, 
  ExternalLink, 
  Github, 
  Search, 
  Sparkles, 
  Layers, 
  Cpu, 
  Globe, 
  Smartphone,
  ChevronRight,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ProjectGalleryPage() {
  const projects: any[] = []; // Empty state for working model

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-900 p-12 sm:p-20 rounded-[4rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">Showcase</Badge>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-none">
            Project <span className="text-primary italic">Gallery.</span>
          </h1>
          <p className="text-xl font-bold text-slate-400 max-w-xl leading-relaxed">
            The decentralized archive of RIT Campus innovation. Explore the next generation of software engineering.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4">
           <Link href="/projects/submit" className="flex-1 md:flex-none">
              <Button className="w-full h-16 rounded-[2rem] px-10 font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary text-white">
                <Plus size={18} />
                Submit Prototype
              </Button>
           </Link>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none translate-x-1/4 translate-y-[-1/4]">
           <Code2 size={400} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3 space-y-8">
           <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] p-10 overflow-hidden border border-slate-50">
              <CardHeader className="p-0 mb-10">
                 <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Search size={28} className="text-primary" />
                 </div>
                 <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Curation Filter</CardTitle>
                 <CardDescription className="font-bold text-slate-500 mt-1">Refine your search across the repo</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Search Keywords</Label>
                    <Input placeholder="Search titles, stacks..." className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm" />
                 </div>
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Tech Stack</Label>
                    <div className="grid grid-cols-2 gap-3">
                       {['Web Dev', 'AI/ML', 'Mobile', 'Blockchain', 'Cybersecurity', 'Cloud'].map(tag => (
                         <button key={tag} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-[11px] font-black text-slate-600 group">
                            {tag}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                         </button>
                       ))}
                    </div>
                 </div>
                 <Button disabled variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 mt-4">
                    Reset Sync
                 </Button>
              </CardContent>
           </Card>

           <div className="p-10 rounded-[3.5rem] bg-primary/5 border border-primary/10 flex items-center gap-6 group hover:bg-primary transition-all duration-500 cursor-pointer">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-xl shadow-primary/20">
                 <Github size={28} />
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors">Join Organization</p>
                 <p className="text-[10px] font-bold text-slate-500 mt-0.5 group-hover:text-white/70 transition-colors">rit-geeks@github</p>
              </div>
           </div>
        </div>

        <div className="flex-1">
          {projects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full min-h-[600px] border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center p-12 text-center space-y-10"
            >
              <div className="relative">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-[-40px] border-[3px] border-dashed border-primary/20 rounded-full"
                 />
                 <div className="h-32 w-32 rounded-[3.5rem] bg-white shadow-2xl flex items-center justify-center ring-1 ring-slate-100 relative z-10">
                    <Layers size={50} className="text-slate-200" />
                 </div>
              </div>
              <div className="space-y-4 max-w-sm mx-auto">
                 <h2 className="text-4xl font-black text-slate-950 tracking-tight leading-tight">The gallery is waiting for its first <span className="text-primary underline decoration-primary/10">Masterpiece.</span></h2>
                 <p className="text-slate-400 font-bold text-lg leading-relaxed">
                   Sync your project repository to the Hub. Verified submissions earn merit points and profile visibility.
                 </p>
              </div>
              <Link href="/projects/submit">
                 <Button className="h-16 rounded-[2rem] px-12 font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 bg-primary text-white hover:scale-105 active:scale-95 transition-all">
                   Initialize First Repository
                   <ArrowRight size={18} />
                 </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project mapping would happen here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`block ${className}`}>{children}</label>;
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
