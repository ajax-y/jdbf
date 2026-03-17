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
  Loader2,
  QrCode,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UserDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

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

      // 2b. Fetch Daily Problems Solved Count (unique problems with Passed status)
      const { data: solvedProblems } = await supabase
        .from('problem_submissions')
        .select('problem_id')
        .eq('user_id', session)
        .eq('status', 'Passed');
      const uniqueSolvedCount = solvedProblems ? new Set(solvedProblems.map((s: any) => s.problem_id)).size : 0;

      // 3. Fetch Leaderboard (Only show users with points > 0, EXCLUDE ADMINS)
      const { data: leaders } = await supabase
        .from('profiles')
        .select('id, full_name, points, username')
        .neq('role', 'admin')
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
          problems_solved: uniqueSolvedCount,
          points: profileData.points || 0,
          rank: (rankCount || 0) + 1
        });
      } else {
        // Fallback for missing profile
        setProfile({
          full_name: "Member",
          points: 0,
          attendance_count: attendanceCount || 0,
          problems_solved: uniqueSolvedCount,
          rank: 0
        });
      }

      if (leaders) {
        setLeaderboard(leaders);
      }

      // 4. Fetch Active Event
      const { data: activeEv } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (activeEv) setActiveEvent(activeEv);

      // 5. Fetch Global Activity (Recent 10)
      // Joins can be complex in single calls without views, so we'll fetch recently updated profiles/attendance
      const { data: recentAttendance } = await supabase
        .from('attendance')
        .select('created_at, profiles(full_name, username), events(title)')
        .order('created_at', { ascending: false })
        .limit(5);
      
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('created_at, profiles(full_name, username), title')
        .order('created_at', { ascending: false })
        .limit(5);

      const combined = [
        ...(recentAttendance || []).map(a => ({
          type: 'attendance',
          time: a.created_at,
          text: `${(a.profiles as any)?.full_name} joined "${(a.events as any)?.title}"`,
          user: (a.profiles as any)?.username
        })),
        ...(recentProjects || []).map(p => ({
          type: 'project',
          time: p.created_at,
          text: `${(p.profiles as any)?.full_name} published "${p.title}"`,
          user: (p.profiles as any)?.username
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      setActivities(combined);

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
      title: "Problems Solved",
      value: profile?.problems_solved || 0,
      description: "Daily challenges cleared",
      icon: Brain,
      color: "text-violet-500",
      bg: "bg-violet-50",
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
      {activeEvent && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group overflow-hidden rounded-[3rem] border border-primary/20 bg-white shadow-2xl shadow-primary/10"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-white to-transparent" />
           <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                 <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary relative">
                    <div className="absolute inset-0 bg-primary rounded-[2rem] animate-ping opacity-20" />
                    <QrCode size={40} className="relative z-10" />
                 </div>
                 <div>
                    <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Signal Detected</Badge>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-none">
                       {activeEvent.title} <span className="text-primary italic">is Live.</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-3">Node Location: {activeEvent.location}</p>
                 </div>
              </div>
              <Link href="/events" className="w-full sm:w-auto">
                 <Button className="w-full sm:w-auto h-20 rounded-[2rem] px-16 font-black text-xs uppercase tracking-[0.2em] gap-4 bg-primary text-white hover:scale-[1.05] transition-all shadow-xl shadow-primary/20">
                    <ArrowUpRight size={24} />
                    Sync Attendance
                 </Button>
              </Link>
           </div>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 px-4 sm:px-0">
        <div className="overflow-hidden">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
            {isLoading ? "Synchronizing..." : `Welcome, ${profile?.full_name?.split(' ')[0] || 'Member'}.`}
          </h1>
          <div className="flex items-center gap-4 mt-6">
             <Badge className={`font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                (profile?.points || 0) >= 100 ? 'bg-slate-900 text-white border-primary/20' :
                (profile?.points || 0) >= 50 ? 'bg-amber-100/80 text-amber-700 border-amber-200 shadow-sm' :
                (profile?.points || 0) >= 20 ? 'bg-slate-100 text-slate-600 border-slate-200' :
                'bg-orange-100/80 text-orange-700 border-orange-200'
              }`}>
                {(profile?.points || 0) >= 100 ? 'Diamond' : 
                 (profile?.points || 0) >= 50 ? 'Gold' :
                 (profile?.points || 0) >= 20 ? 'Silver' : 'Bronze'} Node
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)] bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 flex flex-col h-full">
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/50">
               <div className="flex justify-between items-center text-slate-900">
                  <div>
                     <CardTitle className="text-2xl font-black tracking-tight">Cluster Activity</CardTitle>
                     <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Synchronization Events</CardDescription>
                  </div>
                  <Sparkles size={28} className="text-primary" />
               </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
               <div className="divide-y divide-slate-50">
                  {activities.length > 0 ? activities.map((act, i) => (
                    <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black border border-slate-100 shadow-sm group-hover:rotate-6 transition-all ${
                          act.type === 'attendance' ? 'bg-primary/5 text-primary' : 'bg-amber-50 text-amber-500'
                        }`}>
                           {act.type === 'attendance' ? <Calendar size={24} /> : <Code2 size={24} />}
                        </div>
                        <div>
                           <Link href={`/u/${act.user}`}>
                             <p className="text-lg font-black text-slate-800 leading-none hover:text-primary transition-colors cursor-pointer">{act.text}</p>
                           </Link>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                             <Sparkles size={10} /> {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • @{act.user}
                           </p>
                        </div>
                     </div>
                       <ChevronRight size={20} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    </div>
                  )) : (
                    <div className="p-24 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                       Retrieving node manifest...
                    </div>
                  )}
               </div>
            </CardContent>
            <div className="p-8 bg-slate-50 mt-auto border-t border-slate-100 flex justify-center">
               <Link href="/projects">
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all">
                     Explore Full Pipeline
                  </Button>
               </Link>
            </div>
          </Card>
        </div>

        {/* Global Hall of Fame (Right Column) */}
        <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.03)] bg-slate-900 text-white rounded-[3.5rem] overflow-hidden flex flex-col">
          <CardHeader className="p-10 pb-6">
             <div className="flex justify-between items-center">
                <div>
                   <CardTitle className="text-2xl font-black tracking-tight">Hall of Fame</CardTitle>
                   <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Elite Consensus</CardDescription>
                </div>
                <Trophy size={28} className="text-amber-500" />
             </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <div className="divide-y divide-white/5">
                {leaderboard.slice(0, 5).map((user, i) => (
                  <div key={user.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-slate-500 text-xs">
                           #{i + 1}
                        </div>
                        <div>
                           <Link href={`/u/${user.username}`}>
                             <p className="text-base font-black text-white leading-none hover:text-primary transition-colors cursor-pointer">{user.full_name}</p>
                           </Link>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Node @{user.username || 'member'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-primary tracking-tighter leading-none">{user.points}</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Points</p>
                     </div>
                  </div>
                ))}
             </div>
          </CardContent>
          <div className="p-8 bg-white/5 mt-auto border-t border-white/5">
             <Link href="/leaderboard">
               <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all gap-2">
                  View Standings
                  <ChevronRight size={14} />
               </Button>
             </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)] bg-white border border-slate-100 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden group relative">
          <CardHeader className="p-10 sm:p-12 pb-0 shadow-sm relative z-10">
             <div className="flex justify-between items-start">
               <div>
                  <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Spotlight</Badge>
                  <CardTitle className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight">
                    Project of the <br/><span className="text-primary italic">Week.</span>
                  </CardTitle>
               </div>
               <div className="h-16 w-16 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Code2 size={32} className="text-primary" />
               </div>
             </div>
          </CardHeader>
          <CardContent className="p-10 sm:p-12 pt-8 relative z-10">
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 {profile?.featured_project || 'Aurora Engine'}
               </h3>
               <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-2xl">
                 Advanced cloud-native architecture optimized for real-time data streaming and secure member authorization nodes across the cluster.
               </p>
               <div className="flex flex-wrap gap-2">
                  {['Supabase', 'TypeScript', 'Edge Runtime', 'Tailwind'].map(t => (
                    <span key={t} className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600">{t}</span>
                  ))}
               </div>
               <Link href="/projects">
                 <Button className="w-full sm:w-auto h-16 rounded-2xl px-12 font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 border-none transition-all mt-6 shadow-xl">
                   Explore Gallery
                 </Button>
               </Link>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none translate-x-1/4 translate-y-[-10%]">
             <Code2 size={500} />
          </div>
        </Card>
      </div>
    </div>
  );
}
