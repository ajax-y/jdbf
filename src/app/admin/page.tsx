"use client";

import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield, 
  ArrowUpRight,
  Database,
  BarChart3,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const adminStats = [
  { title: "Active Members", value: "0", icon: Users, color: "text-blue-500", trend: "0%" },
  { title: "Total Sessions", value: "0", icon: Calendar, color: "text-emerald-500", trend: "New" },
  { title: "Pending Reviews", value: "0", icon: Database, color: "text-amber-500", trend: "Clean" },
  { title: "System Health", value: "Optimal", icon: Shield, color: "text-primary", trend: "100%" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
             <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Command Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900">
            Administrative <span className="text-primary italic">Node.</span>
          </h1>
          <p className="text-slate-500 text-lg font-bold">
            Portal secure. No active events detected on the network.
          </p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-2 border-slate-200">
             Network Config
           </Button>
           <Button className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20">
             Initialize Event
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden border border-slate-100">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} />
              </div>
              <CardHeader className="p-8 pb-3">
                <CardDescription className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                   {stat.title}
                </CardDescription>
                <div className="flex items-center gap-3">
                   <CardTitle className="text-3xl font-black text-slate-900">{stat.value}</CardTitle>
                   <span className={`text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 ${stat.color}`}>
                     {stat.trend}
                   </span>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: stat.title === 'System Health' ? '100%' : '5%' }}
                      className={`h-full ${stat.title === 'System Health' ? 'bg-primary' : 'bg-slate-200'}`}
                    />
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-md bg-white border border-slate-100">
            <CardHeader className="p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
               <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Traffic Analytics</CardTitle>
                  <CardDescription className="font-bold">Real-time user engagement monitoring</CardDescription>
               </div>
               <div className="relative w-full sm:w-auto">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input placeholder="Filter by Node..." className="h-10 rounded-xl pl-10 bg-slate-50 border-none w-full sm:w-64" />
               </div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
               <div className="h-72 w-full flex items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                  <div className="text-center space-y-3">
                     <BarChart3 className="mx-auto text-slate-200" size={48} />
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Awaiting Data Stream</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-md bg-primary/5 border border-primary/10">
            <CardHeader className="p-8 sm:p-10">
               <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                  <TrendingUp className="text-primary" />
                  Audit Log
               </CardTitle>
               <CardDescription className="font-bold">Most recent administrative actions</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center gap-4 opacity-30">
                    <div className="h-12 w-12 rounded-2xl bg-slate-200/50 flex items-center justify-center">
                      <Shield className="text-slate-400" size={20} />
                    </div>
                    <div className="flex-1">
                       <p className="font-black text-sm text-slate-900">System Trace {i}</p>
                       <p className="text-[10px] uppercase font-bold text-slate-400">0.00ms latency</p>
                    </div>
                 </div>
               ))}
               <div className="pt-6 border-t border-slate-200/50">
                  <Button disabled variant="ghost" className="w-full rounded-2xl h-14 font-black text-xs uppercase tracking-widest bg-white shadow-sm opacity-50">
                     No Logs Available
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
