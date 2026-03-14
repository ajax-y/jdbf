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
import { Users, QrCode, ArrowLeft, Clock } from "lucide-react";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const [eventInfo, setEventInfo] = useState<{title: string, date: string, time: string} | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // 1. Fetch Event Info from Cloud
    const fetchEventInfo = async () => {
       const { data: event } = await supabase
         .from('events')
         .select('*')
         .eq('id', id)
         .single();
       
       if (event) {
         setEventInfo({
           title: event.title,
           date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
           time: event.time || 'TBD'
         });
       }
    };

    // 2. Fetch Attendees from Cloud
    const fetchAttendees = async () => {
      const { data, count: total } = await supabase
        .from('attendance')
        .select(`
          id,
          created_at,
          profiles:user_id (
            full_name,
            avatar_url,
            tier
          )
        `, { count: 'exact' })
        .eq('event_id', id)
        .order('created_at', { ascending: false });

      if (data) {
        setAttendees(data.map((a: any) => ({
          id: a.id,
          user: {
            full_name: a.profiles?.full_name || 'Unknown',
            avatar_url: a.profiles?.avatar_url || '',
            tier: a.profiles?.tier || 'Member',
          },
          time: new Date(a.created_at).toLocaleString([], { 
            month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          }),
        })));
      }
      setCount(total || 0);
    };

    fetchEventInfo();
    fetchAttendees();

    // 3. Subscribe to REALTIME attendance changes
    const channel = supabase
      .channel(`live-attendance-${id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          table: 'attendance', 
          schema: 'public',
          filter: `event_id=eq.${id}` 
        }, 
        async (payload: RealtimePostgresInsertPayload<any>) => {
           console.log('New attendee for event!', payload);
           // Fetch the profile for this user
           const { data: profile } = await supabase
             .from('profiles')
             .select('full_name, avatar_url, tier')
             .eq('id', payload.new.user_id)
             .single();
           
           const newAttendee: Attendee = {
             id: payload.new.id,
             user: {
               full_name: profile?.full_name || 'New Member',
               avatar_url: profile?.avatar_url || '',
               tier: profile?.tier || 'Member',
             },
             time: 'Just now',
           };
           
           setAttendees(prev => [newAttendee, ...prev]);
           setCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0 mt-8">
      <div className="flex items-center justify-between mb-8 mt-2 px-4 sm:px-0">
         <Link href="/admin/live-wall">
            <Button variant="ghost" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] gap-3 bg-slate-50 border border-slate-200/60 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all h-14 px-8">
               <ArrowLeft size={16} />
               Back to Walls
            </Button>
         </Link>
         <div className="flex items-center gap-4 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 shadow-[0_10px_30px_rgba(47,141,70,0.05)]">
            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] leading-none">Signal Live</span>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-8 sm:p-12 md:p-20 rounded-[3.5rem] sm:rounded-[4.5rem] text-slate-900 shadow-[0_50px_120px_rgba(0,0,0,0.03)] relative overflow-hidden text-center lg:text-left gap-12 sm:gap-16 border border-slate-100">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-[-10%] text-primary">
           <Users size={600} />
        </div>
        
        <div className="relative z-10 flex-1 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
             <span className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-slate-100 text-slate-400">Active Stream Wall</span>
             {eventInfo && (
               <>
                 <span className="px-5 py-2 bg-primary/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-primary/10 text-primary">{eventInfo.date}</span>
                 <span className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-slate-100 text-primary">{eventInfo.time}</span>
               </>
             )}
          </div>
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-10 leading-none text-slate-900 whitespace-normal max-w-4xl break-words">
            {eventInfo?.title || "Loading Session..."}
          </h1>
          <p className="text-lg font-bold text-slate-400 max-w-xl leading-relaxed uppercase tracking-widest text-sm sm:text-base">
            Real-time participants broadcast. Visual feed activates upon successful token verification.
          </p>
        </div>
        
        <div className="relative z-10 text-center bg-slate-50/50 p-12 sm:p-16 rounded-[4rem] sm:rounded-[5rem] border border-slate-100 shadow-inner min-w-[280px] sm:min-w-[400px] group transition-all duration-500 hover:border-primary/20">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-primary drop-shadow-[0_0_10px_rgba(47,141,70,0.1)]">Participation Index</p>
           <span className="text-6xl sm:text-[10rem] md:text-[12rem] font-black tabular-nums leading-none text-slate-900 transition-all group-hover:scale-110 block">{count}</span>
        </div>
      </div>

      {attendees.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-40 flex flex-col items-center text-center space-y-12"
        >
          <div className="h-48 w-48 rounded-[4rem] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200 relative">
             <div className="absolute inset-0 rounded-[4rem] bg-primary opacity-5 animate-pulse" />
             <QrCode size={80} className="text-slate-200" />
          </div>
          <div className="space-y-6">
             <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">Monitoring Ingress Stream...</h2>
             <p className="text-slate-400 font-bold max-w-sm mx-auto text-lg leading-relaxed uppercase tracking-widest text-xs">
                The server is listening for incoming check-ins. Display this wall on the session screen.
             </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {attendees.map((attendee) => (
              <motion.div
                key={attendee.id}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:translate-y-[-10px] transition-all duration-500 overflow-hidden bg-white border border-slate-100 rounded-[3.5rem] group relative">
                   <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <CardContent className="p-10">
                      <div className="flex flex-col items-center text-center gap-8">
                         <div className="relative">
                            <Avatar className="h-28 w-28 ring-4 ring-slate-50 shadow-xl p-1 bg-slate-50">
                               <AvatarImage src={attendee.user.avatar_url} />
                               <AvatarFallback className="text-3xl font-black bg-slate-100 text-primary">
                                  {attendee.user.full_name.charAt(0)}
                               </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                               <Badge className="bg-primary text-white border-none font-black text-[9px] uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-xl shadow-primary/20">
                                  {attendee.user.tier}
                               </Badge>
                            </div>
                         </div>
                         
                         <div className="space-y-3">
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-primary transition-colors">{attendee.user.full_name}</h4>
                            <div className="flex items-center justify-center gap-3">
                               <Clock size={14} className="text-slate-300" />
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{attendee.time}</p>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
