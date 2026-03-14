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
  ShieldCheck, 
  Users, 
  Calendar, 
  Settings, 
  Activity, 
  Clock, 
  Plus, 
  ArrowUpRight,
  Monitor,
  Database,
  Globe,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const adminStats = [
  { title: "Active Members", value: "0", icon: Users, color: "text-blue-500", trend: "Offline" },
  { title: "Total Sessions", value: "0", icon: Calendar, color: "text-emerald-500", trend: "0% Growth" },
  { title: "Pending Reviews", value: "0", icon: Clock, color: "text-amber-500", trend: "Safe" },
  { title: "Server Uptime", value: "99.9%", icon: Monitor, color: "text-indigo-500", trend: "Stable" },
];

const logs = [
  { id: 1, action: "Admin Authorize", user: "Principal Node", time: "Just now", status: "success" },
  { id: 2, action: "Middleware Guard", user: "System", time: "2 mins ago", status: "success" },
  { id: 3, action: "Database Sync", user: "Supabase", time: "10 mins ago", status: "success" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950">
             Command <span className="text-primary italic underline decoration-8 decoration-primary/10">Center.</span>
           </h1>
           <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black">AI</div>
                 ))}
              </div>
              <p className="text-slate-500 font-bold text-sm">3 Active Admin Nodes</p>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 leading-none">Global Network Online</span>
              </div>
           </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <Link href="/admin/create-event" className="flex-1 md:flex-none">
              <Button className="w-full h-16 rounded-[2rem] px-10 font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary text-white">
                <Plus size={18} />
                Deploy Node
              </Button>
           </Link>
           <Button variant="outline" className="h-16 w-16 rounded-[2rem] p-0 border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-90 shadow-xl">
              <Bell size={24} className="text-slate-400" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {adminStats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
             <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white group cursor-default border border-slate-50 overflow-hidden relative">
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <div className={`h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} ring-4 ring-slate-50/50`}>
                        <stat.icon size={26} strokeWidth={2.5} />
                     </div>
                     <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-widest border-slate-100 text-slate-400">{stat.trend}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.title}</p>
                    <h3 className="text-5xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                       {stat.value}
                    </h3>
                  </div>
               </CardContent>
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50 shadow-inner group-hover:bg-primary/20 transition-colors" />
             </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden border border-slate-50">
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
               <div className="flex justify-between items-center">
                  <div>
                     <CardTitle className="text-3xl font-black text-slate-950 tracking-tight">System Logs</CardTitle>
                     <CardDescription className="font-bold text-slate-500 mt-1">Live authentication and node lifecycle events</CardDescription>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none">Live Monitor</Badge>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <div key={log.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all duration-300">
                       <div className="flex items-center gap-6">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} shrink-0 border border-slate-100`}>
                             <Activity size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.user}</p>
                             <p className="text-lg font-black text-slate-900 leading-none">{log.action}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{log.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-10 text-center bg-slate-50/50">
                  <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all">
                     View Complete Archives
                     <ArrowUpRight size={14} />
                  </Button>
               </div>
            </CardContent>
         </Card>

         <div className="space-y-8">
            <Card className="border-none shadow-2xl bg-slate-950 text-white rounded-[3.5rem] p-10 overflow-hidden relative group">
               <div className="relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-10 border border-white/10">
                     <Database className="text-primary" size={28} />
                  </div>
                  <h4 className="text-3xl font-black tracking-tight mb-4">Core Node <span className="text-primary italic">Status.</span></h4>
                  <p className="text-slate-400 font-bold mb-8 leading-relaxed">
                     Hardware health, storage capacity, and network handshake latency.
                  </p>
                  <div className="space-y-6">
                     {[
                       { label: 'CPU Usage', val: '12%', color: 'bg-emerald-500' },
                       { label: 'Memory', val: '2.4 / 8GB', color: 'bg-blue-500' },
                     ].map((s) => (
                       <div key={s.label} className="space-y-3">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                             <span className="text-slate-100">{s.label}</span>
                             <span className="text-primary">{s.val}</span>
                          </div>
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: s.val === '12%' ? '12%' : '30%' }} className={`h-full ${s.color}`} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <Globe size={300} />
               </div>
            </Card>

            <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] p-10 border border-slate-50 group hover:border-primary/20 transition-all duration-500">
               <div className="flex items-center gap-6 mb-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                     <Settings size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                     <h4 className="text-2xl font-black text-slate-900">Config Portal</h4>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">System Globals</p>
                  </div>
               </div>
               <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all">
                  Open Global Registry
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
