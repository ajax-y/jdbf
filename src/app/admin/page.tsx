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

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Total Members", value: "...", icon: Users, color: "text-blue-500", trend: "Loading..." },
    { title: "Active Members", value: "...", icon: Activity, color: "text-emerald-500", trend: "Live Now" },
    { title: "Ongoing Event", value: "...", icon: Calendar, color: "text-amber-500", trend: "Checking..." },
    { title: "Events Conducted", value: "...", icon: Globe, color: "text-indigo-500", trend: "2024-25" },
  ]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Stats
      const { count: memberCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
      const { count: activeEventCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: attendanceCount } = await supabase.from('attendance').select('*', { count: 'exact', head: true });

      setStats([
        { title: "Total Members", value: memberCount?.toString() || "0", icon: Users, color: "text-blue-500", trend: "+12% this month" },
        { title: "Active Members", value: attendanceCount?.toString() || "0", icon: Activity, color: "text-emerald-500", trend: "Live Now" },
        { title: "Ongoing Event", value: activeEventCount?.toString() || "0", icon: Calendar, color: "text-amber-500", trend: "Active" },
        { title: "Events Conducted", value: eventCount?.toString() || "0", icon: Globe, color: "text-indigo-500", trend: "All Time" },
      ]);

      // 2. Fetch Leaderboard
      const { data: topProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
        .limit(5);

      if (topProfiles) {
        setLeaderboard(topProfiles.map((p, i) => ({
          id: p.id,
          name: p.full_name,
          points: p.points,
          rank: i + 1,
          avatar: p.full_name.charAt(0)
        })));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 px-4 sm:px-0">
        <div className="overflow-hidden">
           <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-none text-slate-900">
             Admin <span className="text-primary italic underline underline-offset-[12px] decoration-primary/20">Dashboard.</span>
           </h1>
           <p className="text-slate-500 font-bold text-base mt-8 uppercase tracking-[0.2em]">Welcome back to the GfG RIT Admin Control Suite.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <Link href="/admin/create-event" className="w-full md:w-auto">
              <Button className="w-full h-20 rounded-[2.5rem] px-12 font-black text-xs uppercase tracking-[0.2em] gap-4 shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 bg-primary text-white border-none">
                <Plus size={24} />
                Create Event
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
             <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] transition-all duration-500 rounded-[2.5rem] bg-white group cursor-default border border-slate-100 overflow-hidden relative">
               <CardContent className="p-8 sm:p-10">
                  <div className="flex items-center justify-between mb-10">
                     <div className={`h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon size={28} strokeWidth={2.5} />
                     </div>
                     <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-[0.2em] border-primary/20 text-primary bg-primary/5 px-3 py-1">{stat.trend}</Badge>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.title}</p>
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                       {stat.value}
                    </h3>
                  </div>
               </CardContent>
               <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-50 shadow-inner group-hover:bg-primary transition-colors" />
             </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
          <Card className="border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)] bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 relative">
            <CardHeader className="p-10 sm:p-12 border-b border-slate-50 bg-slate-50/50">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="overflow-hidden">
                     <CardTitle className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3 truncate">Live Leaderboard</CardTitle>
                     <p className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em] mt-3">Real-time member rankings based on club points</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full whitespace-nowrap">Active Season</Badge>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                   {leaderboard.length > 0 ? leaderboard.map((user) => (
                    <div key={user.id} className="p-8 sm:p-10 flex items-center justify-between hover:bg-slate-50/50 transition-all duration-500 group/item">
                       <div className="flex items-center gap-6 sm:gap-8">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 border border-slate-100 shrink-0 text-sm sm:text-xl group-hover/item:text-primary transition-colors">
                             #{user.rank}
                          </div>
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black shrink-0 text-sm sm:text-2xl border border-primary/10">
                             {user.avatar}
                          </div>
                          <div className="overflow-hidden">
                             <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none truncate mb-2 group-hover/item:text-primary transition-colors">{user.name}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Geek Member</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-3xl sm:text-4xl font-black text-primary tracking-tighter tabular-nums leading-none drop-shadow-[0_0_15px_rgba(47,141,70,0.2)]">{user.points}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Points</p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-24 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No data available in cloud.</div>
                  )}
               </div>
               <div className="p-12 text-center bg-slate-50/30 border-t border-slate-50">
                  <Button variant="ghost" className="rounded-2xl h-14 font-black text-[10px] uppercase tracking-[0.3em] gap-3 text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
                     View Complete Leaderboard
                     <ArrowUpRight size={18} />
                  </Button>
               </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
