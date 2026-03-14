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
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4 sm:px-0">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
            Leader<span className="text-primary italic">board.</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg sm:text-xl font-bold">
            The elite players of the GfG RIT coding community.
          </p>
        </div>
        <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl px-8 py-6 flex items-center gap-5 shadow-xl shadow-primary/10">
           <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
              <TrendingUp size={24} strokeWidth={3} />
           </div>
           <div>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-primary leading-none mb-2">Global Rank</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">#{userRank} <span className="text-sm font-bold text-slate-300 ml-1 tracking-normal italic">Ranked</span></p>
           </div>
        </div>
      </div>

      {leaders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mb-10 sm:mb-16 px-4 sm:px-0 pt-6 sm:pt-10">
            {leaders.slice(0, 3).map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-12 flex flex-col items-center text-center gap-6 sm:gap-8 overflow-hidden shadow-2xl transition-all hover:translate-y-[-10px] ${
                  index === 0 ? 'bg-slate-950 text-white order-1 md:order-2 scale-100 md:scale-110 z-10 border-4 border-primary/30' : 'bg-white text-slate-900 md:order-1 border border-slate-100'
                }`}
              >
                {index === 0 && <Crown className="absolute top-6 right-6 sm:top-8 sm:right-8 h-12 w-12 sm:h-16 sm:w-16 text-primary opacity-50 rotate-12" />}
                
                <div className="relative">
                  <Avatar className={`h-24 w-24 sm:h-32 sm:w-32 border-[4px] sm:border-[6px] ${index === 0 ? 'border-primary' : 'border-slate-50'}`}>
                    <AvatarImage src={leader.avatar_url} />
                    <AvatarFallback className={`text-3xl sm:text-4xl font-black ${index === 0 ? 'bg-white/10 text-white' : 'bg-slate-50 text-primary'}`}>
                      {leader.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary text-white flex items-center justify-center text-lg font-black shadow-2xl ring-4 ring-white">
                     {index + 1}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-black tracking-tighter leading-none mb-3">{leader.full_name}</h3>
                  <Badge className={`mt-2 border-none font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full ${
                    index === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {leader.tier || 'Gold Member'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 w-full gap-6 pt-8 border-t border-current/10 tabular-nums">
                   <div>
                      <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mb-1">Points</p>
                      <p className="text-2xl font-black text-primary">{leader.points}</p>
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mb-1">Projects</p>
                      <p className="text-2xl font-black">{leader.project_count || 0}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-slate-100 bg-white shadow-2xl mx-0 sm:mx-0 overflow-x-auto"
          >
            <div className="min-w-[800px]">
              <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="w-[120px] font-black uppercase tracking-[0.2em] text-[10px] p-10 text-slate-400">Rank</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-slate-400">Member Node</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-slate-400">Tier Manifest</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-center text-slate-400">Cloud Projects</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-right text-slate-400">Merit Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader, i) => (
                  <TableRow key={leader.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-default">
                    <TableCell className="p-10 font-black text-3xl text-slate-200 group-hover:text-primary transition-all tabular-nums">
                      #{i + 1}
                    </TableCell>
                    <TableCell className="p-10">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-14 w-14 ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all">
                          <AvatarImage src={leader.avatar_url} />
                          <AvatarFallback className="font-black bg-slate-50 text-slate-400">{leader.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-xl tracking-tighter text-slate-900 leading-none mb-1">{leader.full_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{leader.username || 'member'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-10">
                      <Badge variant="outline" className="border-2 border-slate-100 bg-white font-black uppercase text-[9px] tracking-[0.15em] px-4 py-1.5 rounded-xl shadow-sm">
                        {leader.tier || 'Gold'}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-10 text-center font-black text-xl text-slate-700 tabular-nums">{leader.project_count || 0}</TableCell>
                    <TableCell className="p-10 text-right">
                       <span className="text-4xl font-black text-primary tracking-tighter tabular-nums">{leader.points}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
        </>
      ) : (
        <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 mx-4 sm:mx-0">
           <div className="h-24 w-24 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-8">
              <Ghost size={48} />
           </div>
           <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Cloud Registry Empty.</h2>
           <p className="text-slate-400 font-bold max-w-md leading-relaxed">
             No merit points detected in the system. The leaderboard will automatically populate as soon as nodes participate in upcoming events.
           </p>
        </div>
      )}
    </div>
  );
}
