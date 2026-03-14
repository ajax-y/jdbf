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
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const session = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
      if (!session) return;
      
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
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-950">
            {isLoading ? "Synchronizing..." : `Welcome, ${profile?.full_name?.split(' ')[0] || 'Member'}.`}
          </h1>
          <div className="flex items-center gap-4 mt-4">
             <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                {profile?.tier || 'Standard Tier'}
             </Badge>
             <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
             <p className="text-slate-500 font-bold text-sm">
               {isLoading ? 'Fetching Cloud Data...' : 'Universal Profile Online'}
             </p>
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
        {metrics.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white group cursor-default border border-slate-50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
                    <stat.icon size={28} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.title}</p>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                    {isLoading ? "..." : stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-2xl bg-slate-950 text-white rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden group">
          <CardHeader className="p-8 sm:p-10 pb-0">
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
          <CardContent className="p-8 sm:p-10 pt-8">
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-100 flex items-center gap-3">
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
               <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-200">
                 Live Demo
               </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden border border-slate-50 flex flex-col">
          <CardHeader className="p-10 border-b border-slate-50">
             <div className="flex justify-between items-center">
                <div>
                   <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Cloud Leaderboard</CardTitle>
                   <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time point sync</CardDescription>
                </div>
                <Trophy size={28} className="text-amber-500" />
             </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <div className="divide-y divide-slate-50">
                {leaderboard.length > 0 ? leaderboard.map((user, i) => (
                  <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-300 border border-slate-100 text-xs">
                           #{i + 1}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 leading-none">{user.full_name}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">@{user.username || 'member'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-primary tracking-tighter">{user.points}</p>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Points</p>
                     </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                    Initializing cloud ranking...
                  </div>
                )}
             </div>
          </CardContent>
          <div className="p-6 bg-slate-50/50 mt-auto">
             <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
                Access Global Hall of Fame
                <ChevronRight size={14} className="ml-1" />
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
