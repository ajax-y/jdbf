"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Play, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LiveWallSelector() {
  const [activeEvents] = useState([
    { id: "active", title: "Next.js Masterclass", date: "Mar 14, 2024", attendees: 0 },
  ]);

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
                  <p className="text-sm font-bold text-slate-400">{event.date}</p>
               </div>
               <CardContent className="p-10 flex items-center justify-between bg-slate-50/50">
                  <div className="flex flex-col">
                     <span className="text-2xl font-black text-slate-900">{event.attendees}</span>
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

        {/* Empty placeholder to show how dynamic it is */}
        <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] opacity-60">
           <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
              <LayoutGrid size={24} className="text-slate-300" />
           </div>
           <div>
              <p className="text-sm font-black text-slate-900">Awaiting Signal</p>
              <p className="text-xs font-bold text-slate-400">Stream will activate upon creation</p>
           </div>
        </div>
      </div>
    </div>
  );
}
