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
import { Users, QrCode, ArrowLeft } from "lucide-react";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  const [eventTitle, setEventTitle] = useState("Loading Session...");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // 1. Fetch Event Info
    const fetchEventInfo = async () => {
       // In a real app we'd fetch from Supabase
       // For the working model, we use the ID or a fallback
       setEventTitle(id === "active" ? "Next.js Masterclass" : `Session Node: ${id}`);
    };
    
    // 2. Clear Initial Data (Empty first)
    setAttendees([]);
    setCount(0);
    fetchEventInfo();

    // 3. Subscribe to REALTIME attendance changes FOR THIS SPECIFIC EVENT
    const channel = supabase
      .channel(`live-attendance-${id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          table: 'attendance', 
          schema: 'public',
          filter: `event_id=eq.${id}` // Filter by specific event ID
        }, 
        (payload: RealtimePostgresInsertPayload<any>) => {
           console.log('New attendee for event!', payload);
           // In working model, we simulate adding the attendee to visual list
           setCount(prev => prev + 1);
           // Note: In real app, we'd fetch the user profile here
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      {/* Header Guard */}
      <div className="flex items-center justify-between mb-4">
         <Link href="/admin">
            <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 bg-slate-50">
               <ArrowLeft size={14} />
               Return to Command
            </Button>
         </Link>
         <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Active Link: {id}</span>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center bg-slate-900 p-8 sm:p-16 rounded-[3rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative overflow-hidden text-center lg:text-left gap-12">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <Users size={300} />
        </div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
             <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-white/10">Live Attendance Wall</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-none">
            {eventTitle}
          </h1>
          <p className="text-xl font-bold text-slate-400 max-w-xl">
            Participants are appearing here in real-time as they verify their tokens via the GfG Scanner.
          </p>
        </div>
        
        <div className="relative z-10 text-center bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl min-w-[280px]">
           <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-primary">Confirmed Attendees</p>
           <span className="text-9xl font-black tabular-nums">{count}</span>
        </div>
      </div>

      {attendees.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 flex flex-col items-center text-center space-y-8"
        >
          <div className="h-32 w-32 rounded-[3rem] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
             <QrCode size={48} className="text-slate-200" />
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">The board is set.</h2>
             <p className="text-slate-500 font-bold max-w-sm mx-auto">
               Scanning process initiated. The first attendee to verify will trigger the visual feed.
             </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {attendees.map((attendee, index) => (
              <motion.div
                key={attendee.id}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border border-slate-100">
                   <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center gap-6">
                         <div className="relative">
                            <Avatar className="h-28 w-28 ring-8 ring-slate-50">
                               <AvatarImage src={attendee.user.avatar_url} />
                               <AvatarFallback className="text-3xl font-black bg-primary/5 text-primary">
                                  {attendee.user.full_name.charAt(0)}
                               </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                               <Badge className="bg-primary text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                  {attendee.user.tier}
                               </Badge>
                            </div>
                         </div>
                         
                         <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">{attendee.user.full_name}</h4>
                            <p className="text-[10px] text-primary font-black mt-2 uppercase tracking-widest">{attendee.time}</p>
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

// Re-using UI components locally for clean code
function Button({ children, variant, className, ...props }: any) {
  const variants = {
    ghost: "hover:bg-slate-100 text-slate-600",
    default: "bg-primary text-white shadow-lg"
  };
  return (
    <button className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${variants[variant as keyof typeof variants] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
}
