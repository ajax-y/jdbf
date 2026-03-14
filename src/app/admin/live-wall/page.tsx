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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Attendance <span className="text-primary italic">Walls.</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-bold">
            Monitor real-time participation feeds for your active nodes.
          </p>
        </div>
        <Link href="/admin/create-event">
           <Button className="rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-lg bg-white overflow-hidden group border border-slate-100 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500">
                 <div className="p-10 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="text-primary animate-pulse" size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Node Available</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2 leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-400">{event.date} • {event.time}</p>
                 </div>
                 <CardContent className="p-10 flex items-center justify-between bg-slate-50/50">
                    <div className="flex flex-col">
                       <span className="text-2xl font-black text-slate-900">{event.attendee_count}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendees</span>
                    </div>
                    <Link href={`/admin/live-wall/${event.id}`}>
                       <Button className="rounded-2xl h-12 w-12 p-0 flex items-center justify-center bg-white text-primary border border-slate-200 hover:bg-primary hover:text-white transition-all">
                          <Play size={20} fill="currentColor" />
                       </Button>
                    </Link>
                 </CardContent>
              </Card>
            </motion.div>
          ))}

          {activeEvents.length === 0 && !loading && (
            <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] opacity-60 col-span-full">
               <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <LayoutGrid size={24} className="text-slate-300" />
               </div>
               <div>
                  <p className="text-sm font-black text-slate-900">No Events in Cloud</p>
                  <p className="text-xs font-bold text-slate-400">Create an event to see it appear here in real-time</p>
               </div>
            </div>
          )}

          {/* Placeholder for awaiting nodes */}
          {activeEvents.length > 0 && (
            <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] opacity-60">
               <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <LayoutGrid size={24} className="text-slate-300" />
               </div>
               <div>
                  <p className="text-sm font-black text-slate-900">Awaiting Signal</p>
                  <p className="text-xs font-bold text-slate-400">Stream will activate upon creation</p>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
