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
  Settings, 
  Shield, 
  ArrowUpRight,
  Database,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminStats = [
  { title: "Total Members", value: "854", icon: Users, color: "text-blue-500", trend: "+12%" },
  { title: "Active Events", value: "3", icon: Calendar, color: "text-emerald-500", trend: "+2" },
  { title: "Project Pending", value: "24", icon: Database, color: "text-amber-500", trend: "Important" },
  { title: "System Status", value: "Optimal", icon: Shield, color: "text-primary", trend: "100%" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Administrator <span className="text-primary italic">Command.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, Overseer. System metrics are within normal parameters.
          </p>
        </motion.div>
        
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-2xl h-12 font-bold px-6 border-2">
             System Config
           </Button>
           <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
             Quick Event
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} />
              </div>
              <CardHeader className="p-6 pb-2">
                <CardDescription className="text-xs font-bold uppercase tracking-widest leading-none mb-1">
                   {stat.title}
                </CardDescription>
                <div className="flex items-center gap-3">
                   <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-muted ${stat.color}`}>
                     {stat.trend}
                   </span>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                 <div className="h-1 w-full bg-muted rounded-full overflow-hidden mt-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      className={`h-full bg-primary/40`}
                    />
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-md bg-card/30">
            <CardHeader className="p-8 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-2xl font-black">Engagement Analytics</CardTitle>
                  <CardDescription>Club activity over the last 30 days</CardDescription>
               </div>
               <BarChart3 className="text-primary opacity-20" size={32} />
            </CardHeader>
            <CardContent className="p-8 pt-0">
               <div className="h-64 w-full flex items-end gap-3 px-4">
                  {[40, 70, 45, 90, 65, 80, 55, 75, 95, 60, 85, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-primary/40 to-primary/10 rounded-t-lg relative group"
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {h}%
                       </div>
                    </motion.div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                  <span>Week 01</span>
                  <span>Week 02</span>
                  <span>Week 03</span>
                  <span>Week 04</span>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-md bg-primary/5 border border-primary/10">
            <CardHeader className="p-8">
               <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <TrendingUp className="text-primary" />
                  Top Performers
               </CardTitle>
               <CardDescription>Members with highest contribution</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="flex items-center gap-4 group cursor-default">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {i}
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-sm">Member {i}</p>
                       <p className="text-[10px] uppercase font-black opacity-50">1,240 Points</p>
                    </div>
                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" size={16} />
                 </div>
               ))}
               <Button variant="ghost" className="w-full rounded-xl font-bold text-xs uppercase tracking-widest mt-4">
                  Full Analytics
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
