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
  Trophy, 
  Users, 
  Code2, 
  Target, 
  ArrowUpRight, 
  Star, 
  Zap, 
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const stats = [
  {
    title: "Points Earned",
    value: "0",
    description: "Start participating to earn points",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    title: "Events Attended",
    value: "0",
    description: "No sessions recorded yet",
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Projects Built",
    value: "0",
    description: "Submit your first project",
    icon: Code2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    title: "Global Rank",
    value: "--",
    description: "Participate to get ranked",
    icon: Trophy,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function UserDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950">
            Welcome, <span className="text-primary italic underline decoration-8 decoration-primary/10">Member.</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
             <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Standard Tier</Badge>
             <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
             <p className="text-slate-500 font-bold text-base">Node Sync Active · Mar 2024</p>
          </div>
        </div>
        <Link href="/projects/submit">
          <Button className="h-16 rounded-[2rem] px-10 font-black text-sm uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary text-white">
            <Sparkles size={20} />
            Initialize Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white group cursor-default border border-slate-50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                    <stat.icon size={28} strokeWidth={2.5} />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={18} className="text-slate-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.title}</p>
                  <h3 className="text-5xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-2xl bg-slate-950 text-white rounded-[3.5rem] overflow-hidden group">
          <CardHeader className="p-12 pb-0">
             <div className="flex justify-between items-start">
               <div>
                  <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Spotlight</Badge>
                  <CardTitle className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
                    Project of the <br/><span className="text-primary italic">Week.</span>
                  </CardTitle>
               </div>
               <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
                  <Code2 size={40} className="text-primary" />
               </div>
             </div>
          </CardHeader>
          <CardContent className="p-12 pt-10">
            <div className="flex flex-col sm:flex-row gap-10 items-center">
               <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-black text-slate-100 flex items-center gap-3">
                    Aurora Engine <Activity size={20} className="text-primary" />
                  </h3>
                  <p className="text-slate-400 font-bold text-lg leading-relaxed">
                    A next-generation rendering architecture built using WebGPU. Featured for its high performance and contribution to core libraries.
                  </p>
                  <div className="flex flex-wrap gap-3">
                     {['WebGPU', 'Rust', 'WASM'].map(t => (
                       <span key={t} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300">{t}</span>
                     ))}
                  </div>
               </div>
               <div className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full sm:w-auto h-14 rounded-2xl px-8 font-black text-xs uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-200 shadow-xl shadow-white/5">
                    View Specs
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden flex flex-col">
           <CardHeader className="p-10 pb-0">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                 <Zap size={28} className="text-primary" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-950 tracking-tight">Active Ops</CardTitle>
              <CardDescription className="text-base font-bold text-slate-500">Upcoming tasks and milestones</CardDescription>
           </CardHeader>
           <CardContent className="p-10 pt-8 flex-1">
              <div className="space-y-6">
                 {[
                   { t: 'Profile Authentication', d: 'Verify User ID for full hub access', s: 'Pending' },
                   { t: 'Skill Badge Sync', d: 'Sync your GeeksforGeeks credentials', s: 'Locked' }
                 ].map((op, i) => (
                   <div key={op.t} className="flex gap-5 group cursor-pointer p-2 -m-2 rounded-2xl hover:bg-slate-50 transition-all duration-300">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100">
                         <ChevronRight size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-900">{op.t}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">{op.d}</p>
                      </div>
                   </div>
                 ))}
                 <div className="pt-6">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 hover:text-primary hover:border-primary/20 transition-all">
                       Initialize Operations
                    </Button>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Activity(props: any) {
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
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2" />
    </svg>
  );
}
