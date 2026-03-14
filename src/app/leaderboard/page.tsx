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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 px-4 sm:px-0">
        <div className="flex-1 overflow-hidden">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white leading-none truncate">
            Leader<span className="text-primary italic">board.</span>
          </h1>
          <p className="text-slate-500 mt-6 text-base sm:text-lg lg:text-xl font-bold max-w-xl leading-relaxed uppercase tracking-widest">
            The elite players of the GfG RIT coding community.
          </p>
        </div>
        <div className="bg-[#1a1c2c]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] px-8 py-8 flex items-center gap-6 shadow-2xl w-full sm:w-auto shrink-0 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
           <div className="h-16 w-16 rounded-[1.3rem] bg-white/5 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)] shrink-0 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-8 w-8" strokeWidth={3} />
           </div>
           <div className="overflow-hidden">
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 leading-none mb-3">Global Rank</p>
              <p className="text-4xl font-black text-white tracking-tighter truncate leading-none">#{userRank}</p>
           </div>
        </div>
      </div>

      {leaders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-10 sm:mb-16 px-4 sm:px-0 pt-6 sm:pt-10">
            {leaders.slice(0, 3).map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-12 flex flex-col items-center text-center gap-6 sm:gap-8 overflow-hidden shadow-2xl transition-all hover:translate-y-[-10px] bg-[#1a1c2c]/60 backdrop-blur-xl border border-white/5 ${
                  index === 0 ? 'text-white order-1 lg:order-2 scale-100 lg:scale-110 z-10 border-primary/30 ring-4 ring-primary/10 shadow-primary/20' : 'text-white lg:order-1'
                }`}
              >
                {index === 0 && <Crown className="absolute top-6 right-6 sm:top-8 sm:right-8 h-12 w-12 sm:h-16 sm:w-16 text-primary opacity-50 rotate-12" />}
                
                <div className="relative">
                  <Avatar className={`h-24 w-24 sm:h-32 sm:w-32 border-[4px] sm:border-[6px] border-white/5 bg-white/5 ring-4 ring-primary/10`}>
                    <AvatarImage src={leader.avatar_url} />
                    <AvatarFallback className={`text-3xl sm:text-4xl font-black bg-white/5 text-primary`}>
                      {leader.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary text-white flex items-center justify-center text-lg font-black shadow-2xl border-none">
                     {index + 1}
                  </div>
                </div>

                <div className="z-10">
                  <h3 className={`text-3xl font-black tracking-tighter leading-none mb-3 text-white`}>{leader.full_name}</h3>
                  <Badge className={`mt-2 border border-primary/30 font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]`}>
                    {leader.tier || 'Gold Member'}
                  </Badge>
                </div>

                  <div className="grid grid-cols-2 w-full gap-6 pt-8 border-t border-white/5 tabular-nums z-10">
                    <div>
                       <p className={`text-[10px] uppercase font-black tracking-widest mb-1 text-slate-500`}>Points</p>
                       <p className="text-2xl font-black text-primary leading-none">{leader.points}</p>
                    </div>
                    <div>
                       <p className={`text-[10px] uppercase font-black tracking-widest mb-1 text-slate-500`}>Projects</p>
                       <p className={`text-2xl font-black text-white leading-none`}>{leader.project_count || 0}</p>
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-white/5 bg-[#1a1c2c]/60 backdrop-blur-xl shadow-2xl mx-0 sm:mx-0 overflow-x-auto relative"
          >
            <div className="min-w-[800px]">
              <Table>
               <TableHeader className="bg-white/5">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="w-[120px] font-black uppercase tracking-[0.2em] text-[10px] p-10 text-slate-500">Rank</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-slate-500">Member Node</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-slate-500">Tier Manifest</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-center text-slate-500">Cloud Projects</TableHead>
                  <TableHead className="font-black uppercase tracking-[0.2em] text-[10px] p-10 text-right text-slate-500">Merit Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader, i) => (
                  <TableRow key={leader.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-default">
                    <TableCell className="p-10 font-black text-4xl text-slate-800 group-hover:text-primary transition-all tabular-nums leading-none">
                      #{i + 1}
                    </TableCell>
                    <TableCell className="p-10">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-16 w-16 ring-1 ring-white/10 group-hover:ring-primary/40 transition-all bg-white/5">
                          <AvatarImage src={leader.avatar_url} />
                          <AvatarFallback className="font-black bg-white/5 text-slate-500">{leader.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-2xl tracking-tighter text-white leading-none mb-2">{leader.full_name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">@{leader.username || 'member'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-10">
                      <Badge variant="outline" className="border border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-[0.2em] px-4 py-2 rounded-xl text-slate-400">
                        {leader.tier || 'Gold'}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-10 text-center font-black text-2xl text-slate-300 tabular-nums leading-none">{leader.project_count || 0}</TableCell>
                    <TableCell className="p-10 text-right">
                       <span className="text-4xl font-black text-primary tracking-tighter tabular-nums leading-none drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">{leader.points}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
        </>
      ) : (
        <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 bg-[#1a1c2c]/60 backdrop-blur-xl rounded-[4rem] border border-white/5 mx-4 sm:mx-0">
           <div className="h-24 w-24 rounded-3xl bg-white/5 flex items-center justify-center text-slate-700 mb-8 border border-white/5 shadow-inner">
              <Ghost size={48} />
           </div>
           <h2 className="text-4xl font-black tracking-tighter text-white mb-4">Cloud Registry Empty.</h2>
           <p className="text-slate-500 font-bold max-w-md leading-relaxed uppercase tracking-widest text-xs">
             No merit points detected in the system. The leaderboard will automatically populate as soon as nodes participate in upcoming events.
           </p>
        </div>
      )}
    </div>
  );
}
