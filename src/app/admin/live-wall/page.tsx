"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Play, LayoutGrid, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type CloudEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  is_active: boolean;
  attendee_count?: number;
};

export default function LiveWallSelector() {
  const [activeEvents, setActiveEvents] = useState<CloudEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (events) {
        // For each event, get attendance count
        const eventsWithCounts = await Promise.all(
          events.map(async (event: any) => {
            const { count } = await supabase
              .from('attendance')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', event.id);
            return {
              id: event.id,
              title: event.title,
              date: event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date',
              time: event.time || 'TBD',
              is_active: event.is_active,
              attendee_count: count || 0
            };
          })
        );
        setActiveEvents(eventsWithCounts);
      }
      setLoading(false);
    };

    fetchEvents();

    // Subscribe to new events
    const channel = supabase
      .channel('public:events')
      .on('postgres_changes',
        { event: 'INSERT', table: 'events', schema: 'public' },
        () => { fetchEvents(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 relative">
        <div className="flex-1 min-w-0">
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] break-words">
            Attendance <span className="text-primary italic underline underline-offset-[12px] decoration-primary/20">Walls.</span>
          </h1>
          <p className="text-slate-500 mt-8 text-lg md:text-xl font-bold max-w-2xl uppercase tracking-widest leading-relaxed">
            Monitor real-time participation feeds for your active nodes.
          </p>
        </div>
        <Link href="/admin/create-event" className="w-full lg:w-auto shrink-0">
           <Button className="w-full lg:w-auto rounded-[2.5rem] h-20 px-12 font-black text-xs uppercase tracking-[0.2em] bg-primary text-white border-none shadow-[0_20px_40px_rgba(34,197,94,0.3)] hover:scale-[1.05] active:scale-95 transition-all">
              Initialize New Stream
           </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
           <Loader2 size={40} className="animate-spin mb-4" />
           <p className="font-bold text-sm">Syncing with cloud...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.04)] bg-white overflow-hidden group border border-slate-100 rounded-[3.5rem] hover:border-primary/30 transition-all duration-500 relative">
                 <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="p-10 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Node Available</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 leading-none group-hover:text-primary transition-colors">
                       {event.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{event.date} • {event.time}</p>
                 </div>
                 <CardContent className="p-10 flex items-center justify-between bg-slate-50/30">
                    <div className="flex flex-col">
                       <span className="text-3xl font-black text-slate-900 leading-none tabular-nums">{event.attendee_count}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Attendees Synchronized</span>
                    </div>
                    <Link href={`/admin/live-wall/${event.id}`}>
                       <Button className="rounded-[1.5rem] h-16 w-16 p-0 flex items-center justify-center bg-primary text-white border-none shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:scale-110 active:scale-90 transition-all">
                          <Play size={24} fill="currentColor" />
                       </Button>
                    </Link>
                 </CardContent>
              </Card>
            </motion.div>
          ))}

          {activeEvents.length === 0 && !loading && (
            <div className="border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[3.5rem] p-16 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px] col-span-full">
               <div className="h-24 w-24 rounded-[2rem] bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                  <LayoutGrid size={40} className="text-slate-200" />
               </div>
               <div className="space-y-3">
                  <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">No Events in Cloud</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Create an event to see it appear here in real-time</p>
               </div>
            </div>
          )}
 
           {/* Placeholder for awaiting nodes */}
           {activeEvents.length > 0 && (
            <div className="border-2 border-dashed border-slate-100 bg-slate-50/30 rounded-[3.5rem] p-16 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px] opacity-40">
               <div className="h-24 w-24 rounded-[2rem] bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                  <LayoutGrid size={40} className="text-slate-200" />
               </div>
               <div className="space-y-3">
                  <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">Awaiting Signal</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stream will activate upon creation</p>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
