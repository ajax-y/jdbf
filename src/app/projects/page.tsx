"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Layout,
  Rocket
} from "lucide-react";

export default function ProjectGalleryPage() {
  const [projects] = useState([]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-slate-100">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Project <span className="text-primary italic">Gallery.</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-bold">
            The collection of campus-wide coding breakthroughs.
          </p>
        </div>
        <Link href="/projects/submit" className="w-full sm:w-auto">
          <Button className="w-full rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 bg-primary text-white">
            <Plus size={18} />
            Submit Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-32 flex flex-col items-center text-center space-y-8"
        >
          <div className="relative">
             <div className="h-32 w-32 rounded-[3rem] bg-slate-50 flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                <Layout size={48} className="text-slate-200" />
             </div>
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
             >
                <Plus size={20} />
             </motion.div>
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gallery is Waiting</h2>
             <p className="text-slate-500 font-bold max-w-sm mx-auto">
               Be the first to showcase your innovation to the GfG community. Use the submit button to begin.
             </p>
          </div>
          <Link href="/projects/submit">
             <Button variant="outline" className="rounded-2xl h-12 px-8 border-2 font-black text-[10px] uppercase tracking-widest border-slate-200 hover:border-primary/20 hover:bg-primary/5 transition-all">
                Learn the submission process
             </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* This part will be populated dynamically if state changes */}
        </div>
      )}

      {/* Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
         {[
           { icon: Rocket, title: "Deploy Ready", desc: "Ensure your project has a live URL or repository." },
           { icon: Layout, title: "Clean UI", desc: "Upload high-quality screenshots for the showcase." },
           { icon: Plus, title: "Open Source", desc: "Help others learn by sharing your source code." }
         ].map((guide, i) => (
           <div key={i} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-5">
                 <guide.icon size={22} />
              </div>
              <h4 className="font-black text-slate-900 mb-2">{guide.title}</h4>
              <p className="text-xs font-bold text-slate-400 leading-relaxed px-4">{guide.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
