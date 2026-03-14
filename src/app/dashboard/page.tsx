"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Users,
  Calendar,
  Code,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [points] = useState(0);
  const [events] = useState(0);
  const [projects] = useState(0);

  const stats = [
    {
      title: "Points earned",
      value: points.toLocaleString(),
      description: "Attend events to earn",
      icon: Trophy,
      color: "text-amber-500",
    },
    {
      title: "Events Attended",
      value: events.toString(),
      description: "Scan QR at sessions",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Projects Built",
      value: projects.toString(),
      description: "Share your innovations",
      icon: Code,
      color: "text-emerald-500",
    },
    {
      title: "Club Rank",
      value: points > 0 ? "#42" : "None",
      description: points > 0 ? "Top 5% of members" : "Complete activities to rank",
      icon: Target,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Welcome back, <span className="text-primary italic">Member.</span>
          </h1>
          <p className="text-slate-500 text-lg font-bold">
            Portal operational. You're currently a{" "}
            <span className="font-black text-slate-400 uppercase tracking-widest text-xs py-1 px-3 bg-slate-100 rounded-full">
              Standard Tier
            </span>{" "}
            member. 
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/projects/submit">
            <Button className="w-full sm:w-auto rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest flex items-center gap-2 group shadow-xl shadow-primary/20">
              Submit New Project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md bg-white hover:shadow-2xl transition-all duration-500 group overflow-hidden relative border border-slate-100">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} />
              </div>
              <CardHeader className="p-8 pb-3">
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {stat.title}
                </CardDescription>
                <div className="flex items-center gap-3 mt-2">
                   <div className={`p-2 rounded-xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon size={20} />
                   </div>
                   <CardTitle className="text-3xl font-black text-slate-900">{stat.value}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-xs text-slate-500 font-bold border-t border-slate-50 pt-4">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Live Campus Feed</CardTitle>
                  <CardDescription className="font-bold">Latest club activities and sessions</CardDescription>
                </div>
                <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest bg-slate-50 h-10 px-4">
                  Full Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="p-12 text-center space-y-4">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-4">
                     <Calendar className="text-slate-200" size={40} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">No Check-ins Yet</h4>
                  <p className="text-slate-500 font-bold max-w-sm mx-auto">
                    Your activity history will appear here once you attend your first session or publish a project.
                  </p>
                  <Link href="/events" className="inline-block mt-4">
                     <Button variant="outline" className="rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-2">
                        Browse Events
                     </Button>
                  </Link>
               </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full border-none shadow-md overflow-hidden bg-primary/5 border border-primary/10">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                <Target className="text-primary" />
                Tier Progress
              </CardTitle>
              <CardDescription className="font-bold">Standard to Bronze Journey</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-10">
              <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
                 <svg className="h-full w-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-primary/10"
                    />
                    <motion.circle
                      initial={{ strokeDashoffset: 502.6 }}
                      animate={{ strokeDashoffset: 502.6 }}
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={502.6}
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900">0%</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Complete</span>
                  </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <span className="text-sm font-black text-slate-900">Contributions</span>
                  <span className="text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-full">0/5</span>
                </div>
                <div className="flex justify-between items-center p-5 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <span className="text-sm font-black text-slate-900">Attendance</span>
                  <span className="text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-full">0/10</span>
                </div>
              </div>

              <Button disabled className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest opacity-50">
                Claim Reward
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
