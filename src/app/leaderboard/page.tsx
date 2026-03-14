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
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

const leaders = [
  { id: 1, name: "John Doe", projects: 12, attendance: 24, points: 2850, tier: "Gold", rank: 1 },
  { id: 2, name: "Sarah Chen", projects: 10, attendance: 20, points: 2400, tier: "Gold", rank: 2 },
  { id: 3, name: "Alex Rivera", projects: 8, attendance: 22, points: 2150, tier: "Silver", rank: 3 },
  { id: 4, name: "Emma Watson", projects: 6, attendance: 18, points: 1800, tier: "Silver", rank: 4 },
  { id: 5, name: "Michael Scott", projects: 4, attendance: 15, points: 1450, tier: "Bronze", rank: 5 },
  { id: 6, name: "Pam Beesly", projects: 3, attendance: 14, points: 1200, tier: "Bronze", rank: 6 },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tighter">
            Leader<span className="text-primary">board.</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            The elite players of the GfG coding community.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 flex items-center gap-4">
           <TrendingUp className="text-primary" />
           <div>
              <p className="text-[10px] uppercase font-black tracking-widest leading-none">Global Rank</p>
              <p className="text-2xl font-black">#42 <span className="text-sm font-medium opacity-50">/ 850</span></p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {leaders.slice(0, 3).map((leader, index) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-[3rem] p-10 flex flex-col items-center text-center gap-6 overflow-hidden shadow-2xl ${
              index === 0 ? 'bg-primary text-primary-foreground order-1 md:order-2 scale-110 z-10' : 'bg-card md:order-1'
            }`}
          >
            {index === 0 && <Crown className="absolute top-6 right-6 h-12 w-12 opacity-20 rotate-12" />}
            
            <div className="relative">
              <Avatar className={`h-28 w-28 border-4 ${index === 0 ? 'border-white/20' : 'border-primary/10'}`}>
                <AvatarFallback className={`text-3xl font-black ${index === 0 ? 'bg-white/10' : 'bg-primary/5 text-primary'}`}>
                  {leader.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-0 h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center font-black shadow-xl">
                 {leader.rank}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight">{leader.name}</h3>
              <Badge className={`mt-2 border-none font-black uppercase tracking-widest text-[10px] ${
                index === 0 ? 'bg-white/20' : 'bg-primary/10 text-primary'
              }`}>
                {leader.tier} Member
              </Badge>
            </div>

            <div className="grid grid-cols-2 w-full gap-4 pt-4 border-t border-current/10">
               <div>
                  <p className="text-[10px] uppercase font-black opacity-60">Points</p>
                  <p className="text-xl font-black">{leader.points}</p>
               </div>
               <div>
                  <p className="text-[10px] uppercase font-black opacity-60">Projects</p>
                  <p className="text-xl font-black">{leader.projects}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-[2.5rem] overflow-hidden border border-border/10 bg-card shadow-xl"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/10 hover:bg-transparent">
              <TableHead className="w-[100px] font-black uppercase tracking-widest text-[10px] p-8">Rank</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] p-8">Member</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] p-8">Tier</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] p-8 text-center">Projects</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] p-8 text-center">Attendance</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] p-8 text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader) => (
              <TableRow key={leader.id} className="border-b border-border/5 hover:bg-primary/5 transition-colors group cursor-default">
                <TableCell className="p-8 font-black text-2xl opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all">
                  #{leader.rank}
                </TableCell>
                <TableCell className="p-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="font-bold bg-muted/50">{leader.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-black text-lg tracking-tight">{leader.name}</span>
                  </div>
                </TableCell>
                <TableCell className="p-8">
                  <Badge variant="outline" className="border-none bg-muted/30 font-bold uppercase text-[10px] tracking-widest">
                    {leader.tier}
                  </Badge>
                </TableCell>
                <TableCell className="p-8 text-center font-black text-lg">{leader.projects}</TableCell>
                <TableCell className="p-8 text-center font-black text-lg">{leader.attendance}</TableCell>
                <TableCell className="p-8 text-right">
                   <span className="text-2xl font-black text-primary">{leader.points}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
