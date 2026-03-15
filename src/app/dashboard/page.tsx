"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  Trophy, 
  Code2, 
  ArrowUpRight, 
  Star, 
  Calendar,
  Sparkles,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UserDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    async function fetchData() {
      const session = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session)
        .single();

      // 2. Fetch Real Attendance Count
      const { count: attendanceCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session);

      // 3. Fetch Leaderboard (Only show users with points > 0)
      const { data: leaders } = await supabase
        .from('profiles')
        .select('id, full_name, points, username')
        .gt('points', 0)
        .order('points', { ascending: false })
        .limit(5);

      if (profileData) {
        // Calculate dynamic rank for user
        const { count: rankCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('points', profileData.points || 0);

        setProfile({
          ...profileData,
          attendance_count: attendanceCount || 0,
          points: profileData.points || 0,
          rank: (rankCount || 0) + 1
        });
      }

      if (leaders) {
        setLeaderboard(leaders);
      }

      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (!isMounted) return null;

  const metrics = [
    {
      title: "Points Earned",
      value: profile?.points || 0,
      description: "Cloud-synced merit points",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Events Attended",
      value: profile?.attendance_count || 0,
      description: "Verified session nodes",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Projects Built",
      value: profile?.project_count || 0,
      description: "Deployed to gallery",
      icon: Code2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Global Rank",
      value: profile?.rank ? `#${profile.rank}` : "--",
      description: "Position in RIT Network",
      icon: Trophy,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 px-4 sm:px-0">
        <div className="overflow-hidden">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
            {isLoading ? "Synchronizing..." : `Welcome, ${profile?.full_name?.split(' ')[0] || 'Member'}.`}
          </h1>
          <div className="flex items-center gap-4 mt-6">
             <Badge className="bg-primary/10 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                {profile?.tier || 'Standard Tier'}
             </Badge>
             <div className="h-1 w-1 rounded-full bg-slate-400" />
             <p className="text-slate-500 font-bold text-xs sm:text-sm uppercase tracking-widest">
               {isLoading ? 'Fetching Cloud Data...' : 'Universal Profile Online'}
             </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-[-20%]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={400} />
          </motion.div>
        </div>
        <Link href="/projects/submit" className="w-full lg:w-auto">
          <Button className="w-full lg:w-auto h-20 rounded-[2.5rem] px-12 font-black text-xs uppercase tracking-[0.2em] gap-4 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary text-white border-none">
            <Sparkles size={24} />
            Initialize Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 rounded-[2.5rem] bg-white group cursor-default border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary/40 transition-all" />
              <CardContent className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className={`h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} border border-slate-100 transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-12 duration-500 shadow-sm`}>
                    <stat.icon size={28} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.title}</p>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                    {isLoading ? "..." : stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed uppercase tracking-widest">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)] bg-slate-900 text-white rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden group">
          <CardHeader className="p-8 sm:p-10 pb-0 shadow-sm relative z-10">
             <div className="flex justify-between items-start">
               <div>
                  <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Spotlight</Badge>
                  <CardTitle className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight">
                    Project of the <br/><span className="text-primary italic">Week.</span>
                  </CardTitle>
               </div>
               <div className="h-16 w-16 rounded-[1.5rem] sm:rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Code2 size={32} className="text-primary" />
               </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 sm:p-10 pt-8 relative z-10">
            <div className="space-y-6">
               <h3 className="text-xl font-black text-white flex items-center gap-3">
                 {profile?.featured_project || 'Aurora Engine'}
               </h3>
               <p className="text-slate-400 font-bold text-base leading-relaxed">
                 Advanced cloud-native architecture optimized for real-time data streaming and secure member authorization.
               </p>
               <div className="flex flex-wrap gap-2">
                  {['Supabase', 'TypeScript', 'Edge Runtime'].map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300">{t}</span>
                  ))}
               </div>
               <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-200 border-none transition-all">
                 Live Demo
               </Button>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none translate-x-1/4 translate-y-[-10%]">
             <Code2 size={400} />
          </div>
        </Card>

        <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.03)] bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 flex flex-col">
          <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/50">
             <div className="flex justify-between items-center text-slate-900">
                <div>
                   <CardTitle className="text-2xl font-black tracking-tight">Cloud Leaderboard</CardTitle>
                   <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time point sync</CardDescription>
                </div>
                <Trophy size={28} className="text-amber-500" />
             </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <div className="divide-y divide-slate-50">
                {leaderboard.length > 0 ? leaderboard.map((user, i) => (
                  <div key={user.id} className="p-6 sm:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 border border-slate-100 text-xs shadow-sm">
                           #{i + 1}
                        </div>
                        <div>
                           <p className="text-sm sm:text-base font-black text-slate-900 leading-none">{user.full_name}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">@{user.username || 'member'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl sm:text-2xl font-black text-primary tracking-tighter leading-none">{user.points}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Points</p>
                     </div>
                  </div>
                )) : (
                  <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Initializing cloud ranking...
                  </div>
                )}
             </div>
          </CardContent>
          <div className="p-8 bg-slate-50 mt-auto border-t border-slate-100">
             <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all gap-2 hover:bg-white">
                Access Global Hall of Fame
                <ChevronRight size={14} />
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
