"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, TrendingUp, Loader2, Ghost } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | string>("--");

  useEffect(() => {
    const fetchData = async () => {
      const session = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];

      // 1. Fetch Leaders (Only those with points > 0)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .gt('points', 0)
        .order('points', { ascending: false });

      if (data) {
        setLeaders(data);

        // 2. Find Current User Rank
        if (session) {
          const rank = data.findIndex(p => p.id === session);
          setUserRank(rank !== -1 ? rank + 1 : "--");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 px-4 sm:px-0">
        <div className="flex-1 overflow-hidden">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-slate-900 leading-none truncate">
            Leader<span className="text-primary italic underline underline-offset-[16px] decoration-primary/10">board.</span>
          </h1>
          <p className="text-slate-500 mt-10 text-xl font-bold max-w-xl leading-relaxed uppercase tracking-widest text-sm sm:text-base">
            The elite players of the GfG RIT coding community.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[3rem] px-10 py-10 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] w-full sm:w-auto shrink-0 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/20" />
           <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <TrendingUp className="h-8 w-8" strokeWidth={3} />
           </div>
           <div className="overflow-hidden">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 leading-none mb-4">Universal Rank</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter truncate leading-none">#{userRank}</p>
           </div>
        </div>
      </div>

      {leaders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mb-16 sm:mb-24 px-4 sm:px-0 pt-10">
            {leaders.slice(0, 3).map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-[4rem] p-10 sm:p-14 flex flex-col items-center text-center gap-8 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.05)] transition-all hover:translate-y-[-12px] bg-white border border-slate-100 ${
                  index === 0 ? 'order-1 lg:order-2 scale-100 lg:scale-110 z-10 border-primary/20 ring-8 ring-primary/5' : 'lg:order-1'
                }`}
              >
                {index === 0 && <Crown className="absolute top-8 right-8 h-20 w-20 text-primary opacity-5 rotate-12" />}
                
                <div className="relative">
                  <Avatar className={`h-28 w-28 sm:h-36 sm:w-36 border-[8px] border-slate-50 shadow-xl ring-1 ring-slate-200`}>
                    <AvatarImage src={leader.avatar_url} />
                    <AvatarFallback className={`text-4xl sm:text-5xl font-black bg-slate-100 text-primary`}>
                      {leader.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-3 -right-3 h-12 w-12 sm:h-14 sm:w-14 rounded-[1.5rem] bg-primary text-white flex items-center justify-center text-xl font-black shadow-xl border-4 border-white">
                     {index + 1}
                  </div>
                </div>

                <div className="z-10 mt-2">
                  <h3 className={`text-3xl sm:text-4xl font-black tracking-tighter leading-none mb-4 text-slate-900`}>{leader.full_name}</h3>
                  <Badge className={`mt-2 border border-primary/10 font-black uppercase tracking-[0.2em] text-[10px] px-6 py-2.5 rounded-full bg-primary/5 text-primary shadow-sm`}>
                    {leader.tier || 'Standard'} Node
                  </Badge>
                </div>

                  <div className="grid grid-cols-2 w-full gap-8 pt-10 border-t border-slate-100 tabular-nums z-10">
                    <div>
                       <p className={`text-[10px] uppercase font-black tracking-[0.3em] mb-3 text-slate-400`}>Merit</p>
                       <p className="text-3xl font-black text-primary leading-none">{leader.points}</p>
                    </div>
                    <div>
                       <p className={`text-[10px] uppercase font-black tracking-[0.3em] mb-3 text-slate-400`}>Projects</p>
                       <p className={`text-3xl font-black text-slate-900 leading-none`}>{leader.project_count || 0}</p>
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-[3rem] sm:rounded-[4rem] overflow-hidden border border-slate-100 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.04)] mx-0 sm:mx-0 overflow-x-auto relative"
          >
            <div className="min-w-[1000px] p-8 sm:p-12">
               <div className="flex items-center justify-between mb-12 px-6">
                  <div className="flex items-center gap-6">
                     <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <Trophy size={28} />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-slate-900 leading-none">Hall of Fame</h2>
                        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 mt-2">Verified Merit Index</p>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     {['All Time', 'This Month', 'Regional'].map((tab, i) => (
                        <button key={tab} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}>{tab}</button>
                     ))}
                  </div>
               </div>
              <Table>
               <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="w-[150px] font-black uppercase tracking-[0.3em] text-[10px] px-10 py-8 text-slate-400">Rank</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.3em] text-[10px] px-10 py-8 text-slate-400">Contributor</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.3em] text-[10px] px-10 py-8 text-slate-400">Node Status</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.3em] text-[10px] px-10 py-8 text-center text-slate-400">Deployed Stacks</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.3em] text-[10px] px-10 py-8 text-right text-slate-400">Point Index</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader, i) => (
                  <TableRow key={leader.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors group cursor-default">
                    <TableCell className="px-10 py-10">
                       <div className={`h-14 w-14 rounded-full flex items-center justify-center font-black text-2xl transition-all ${i < 3 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-900'}`}>
                         {i + 1}
                       </div>
                    </TableCell>
                    <TableCell className="px-10 py-10">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-16 w-16 border-4 border-white shadow-md transition-all group-hover:scale-110">
                          <AvatarImage src={leader.avatar_url} />
                          <AvatarFallback className="font-black bg-slate-50 text-slate-400">{leader.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-2xl tracking-tighter text-slate-900 leading-none mb-2 group-hover:text-primary transition-colors">{leader.full_name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">@{leader.username || 'member'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-10 py-10">
                      <Badge variant="ghost" className="bg-slate-100 text-slate-500 font-black uppercase text-[11px] tracking-[0.2em] px-5 py-2 rounded-2xl">
                        {leader.tier || 'Junior'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-10 py-10 text-center font-black text-2xl text-slate-900 tabular-nums">{leader.project_count || 0}</TableCell>
                    <TableCell className="px-10 py-10 text-right">
                       <span className="text-5xl font-black text-primary tracking-tighter tabular-nums leading-none">{leader.points}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
        </>
      ) : (
        <div className="h-[500px] flex flex-col items-center justify-center text-center p-16 bg-white rounded-[4rem] border border-slate-100 shadow-2xl mx-4 sm:mx-0">
           <div className="h-32 w-32 rounded-[3.5rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-10 border border-slate-100 shadow-inner">
              <Ghost size={56} />
           </div>
           <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">Cloud Registry Empty.</h2>
           <p className="text-slate-400 font-bold max-w-md leading-relaxed uppercase tracking-[0.3em] text-xs">
             No merit points detected in the system. The leaderboard will automatically populate as soon as nodes participate in upcoming events.
           </p>
        </div>
      )}
    </div>
  );
}
