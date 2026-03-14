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
      <div className="flex items-center justify-between mb-4 mt-2">
         <Link href="/admin/live-wall">
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 bg-white border shadow-sm h-10 px-4">
               <ArrowLeft size={14} />
               Back to Walls
            </Button>
         </Link>
         <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Live</span>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center bg-slate-900 p-10 sm:p-20 rounded-[3.5rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden text-center lg:text-left gap-12">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <Users size={400} />
        </div>
        
        <div className="relative z-10 flex-1">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
             <span className="px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-white/10">Active Stream Wall</span>
             {eventInfo && (
               <>
                 <span className="px-4 py-1.5 bg-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-primary/30 text-primary">{eventInfo.date}</span>
                 <span className="px-4 py-1.5 bg-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/30 text-emerald-400">{eventInfo.time}</span>
               </>
             )}
          </div>
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter mb-8 leading-none">
            {eventInfo?.title || "Loading Session..."}
          </h1>
          <p className="text-xl font-bold text-slate-400 max-w-xl leading-relaxed">
            Real-time participants broadcast. Visual feed activates upon successful token verification.
          </p>
        </div>
        
        <div className="relative z-10 text-center bg-white/10 backdrop-blur-3xl p-14 rounded-[4rem] border border-white/10 shadow-2xl min-w-[320px]">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Live Count</p>
           <span className="text-[10rem] font-black tabular-nums leading-none">{count}</span>
        </div>
      </div>

      {attendees.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-32 flex flex-col items-center text-center space-y-8"
        >
          <div className="h-40 w-40 rounded-[3.5rem] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
             <QrCode size={64} className="text-slate-200" />
          </div>
          <div className="space-y-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Monitoring Stream...</h2>
             <p className="text-slate-400 font-bold max-w-sm mx-auto text-lg leading-relaxed">
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
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border border-slate-100 rounded-[2.5rem]">
                   <CardContent className="p-10">
                      <div className="flex flex-col items-center text-center gap-8">
                         <div className="relative">
                            <Avatar className="h-24 w-24 ring-[8px] ring-slate-50 shadow-inner">
                               <AvatarImage src={attendee.user.avatar_url} />
                               <AvatarFallback className="text-2xl font-black bg-primary/5 text-primary">
                                  {attendee.user.full_name.charAt(0)}
                               </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                               <Badge className="bg-primary text-white border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                  {attendee.user.tier}
                               </Badge>
                            </div>
                         </div>
                         
                         <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">{attendee.user.full_name}</h4>
                            <div className="flex items-center justify-center gap-2 mt-2">
                               <Clock size={12} className="text-slate-400" />
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{attendee.time}</p>
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
