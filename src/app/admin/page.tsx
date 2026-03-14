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
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter">
             <span className="text-slate-950">Admin</span> <span className="text-primary italic">Dashboard.</span>
           </h1>
           <p className="text-slate-500 font-bold text-sm mt-4">Welcome back to the GfG RIT Admin Control Suite.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <Link href="/admin/create-event" className="flex-1 md:flex-none">
              <Button className="w-full h-16 rounded-[2rem] px-10 font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary text-white">
                <Plus size={18} />
                Create Event
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
             <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white group cursor-default border border-slate-50 overflow-hidden relative">
               <CardContent className="p-6 sm:p-8">
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

      <div className="grid grid-cols-1 gap-8">
         <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden border border-slate-50">
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
               <div className="flex justify-between items-center">
                  <div>
                     <CardTitle className="text-3xl font-black text-slate-950 tracking-tight">Live Leaderboard</CardTitle>
                     <CardDescription className="font-bold text-slate-500 mt-1">Real-time member rankings based on club points</CardDescription>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none">Active Season</Badge>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {leaderboard.length > 0 ? leaderboard.map((user) => (
                    <div key={user.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all duration-300">
                       <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 shrink-0">
                             #{user.rank}
                          </div>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
                             {user.avatar}
                          </div>
                          <div>
                             <p className="text-lg font-black text-slate-900 leading-none">{user.name}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Geek Member</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-primary tracking-tighter tabular-nums leading-none">{user.points}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Points</p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center text-slate-400 font-bold">No data available in cloud.</div>
                  )}
               </div>
               <div className="p-10 text-center bg-slate-50/50">
                  <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all">
                     View Complete Leaderboard
                     <ArrowUpRight size={14} />
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
