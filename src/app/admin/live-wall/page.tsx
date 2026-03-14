"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Activity } from "lucide-react";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

type Attendee = {
  id: string;
  user: {
    full_name: string;
    avatar_url: string;
    tier: string;
  };
  time: string;
};

export default function LiveWallPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    const fetchInitial = async () => {
       setCount(12);
       setAttendees([
         { id: '1', user: { full_name: 'Sarah Chen', avatar_url: '', tier: 'Gold' }, time: 'Just now' },
         { id: '2', user: { full_name: 'Alex Rivera', avatar_url: '', tier: 'Silver' }, time: '2 mins ago' },
       ]);
    };
    
    fetchInitial();

    // Subscribe to REALTIME attendance changes
    const channel = supabase
      .channel('live-attendance')
      .on('postgres_changes', { event: 'INSERT', table: 'attendance', schema: 'public' }, (payload: RealtimePostgresInsertPayload<any>) => {
          console.log('New attendance!', payload);
          setCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-center bg-primary p-12 rounded-[3rem] text-primary-foreground shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Users size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
             <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Live Wall</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            Mar 14 Masterclass: <br />
            <span className="opacity-70">Next.js & Supabase</span>
          </h1>
          <p className="text-xl font-medium opacity-80">
            Join the movement. Scan the QR to mark your presence.
          </p>
        </div>
        
        <div className="relative z-10 text-center bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20">
           <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Total Present</p>
           <span className="text-8xl font-black">{count}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {attendees.map((attendee, index) => (
            <motion.div
              key={attendee.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: index * 0.05 
              }}
            >
              <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden h-full">
                 <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                       <div className="relative">
                          <Avatar className="h-24 w-24 ring-4 ring-primary/10 group-hover:ring-primary/40 transition-all duration-500">
                             <AvatarImage src={attendee.user.avatar_url} />
                             <AvatarFallback className="text-2xl font-black bg-primary/5 text-primary">
                                {attendee.user.full_name.charAt(0)}
                             </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                             <Badge className={`border-none font-black text-[10px] uppercase tracking-widest ${
                               attendee.user.tier === 'Gold' ? 'bg-amber-500' : 'bg-slate-400'
                             }`}>
                                {attendee.user.tier}
                             </Badge>
                          </div>
                       </div>
                       
                       <div className="mt-2 text-balance">
                          <h4 className="text-xl font-black tracking-tight">{attendee.user.full_name}</h4>
                          <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-wider">{attendee.time}</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
