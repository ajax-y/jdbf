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

const stats = [
  {
    title: "Points earned",
    value: "1,250",
    description: "+12% from last month",
    icon: Trophy,
    color: "text-amber-500",
  },
  {
    title: "Events Attended",
    value: "14",
    description: "4 upcoming this week",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    title: "Projects Built",
    value: "6",
    description: "2 featured on gallery",
    icon: Code,
    color: "text-emerald-500",
  },
  {
    title: "Club Rank",
    value: "#42",
    description: "Top 5% of members",
    icon: Target,
    color: "text-primary",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Welcome back, <span className="text-primary">John.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Good morning! You're currently a{" "}
            <span className="font-bold text-amber-500 uppercase tracking-widest text-sm">
              Gold Tier
            </span>{" "}
            member. 
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button className="rounded-2xl h-12 px-6 font-bold flex items-center gap-2 group shadow-lg shadow-primary/20">
            Submit New Project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon size={80} />
              </div>
              <CardHeader className="p-6 pb-2">
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  {stat.title}
                </CardDescription>
                <div className="flex items-center gap-3 mt-1">
                   <stat.icon className={`h-5 w-5 ${stat.color}`} />
                   <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 mt-2">
                <p className="text-xs text-muted-foreground font-medium">
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
          <Card className="h-full border-none shadow-md overflow-hidden bg-card/30">
            <CardHeader className="p-8 border-b bg-muted/20">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-black">Upcoming Events</CardTitle>
                  <CardDescription>Don't miss out on these sessions</CardDescription>
                </div>
                <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6 p-6 border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Mar</span>
                    <span className="text-2xl font-black">{14 + i}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg">Next.js & Supabase Masterclass: Episode {i}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5"><Users size={14} /> 42 attending</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> 6:00 PM</span>
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-primary-foreground group-hover:scale-105 transition-all">
                    Detail
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full border-none shadow-md overflow-hidden bg-primary/5 border border-primary/10">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Target className="text-primary" />
                Tier Progress
              </CardTitle>
              <CardDescription>Your journey to Platinum</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
                 <svg className="h-full w-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="transparent"
                      className="text-primary/10"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="transparent"
                      strokeDasharray={502.6}
                      strokeDashoffset={150.8}
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black">70%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Complete</span>
                  </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-background shadow-sm border border-border/30">
                  <span className="text-sm font-bold">Project Contributions</span>
                  <span className="text-sm font-black text-primary">6/10</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-background shadow-sm border border-border/30">
                  <span className="text-sm font-bold">Event Attendance</span>
                  <span className="text-sm font-black text-primary">14/20</span>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                Claim Reward
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
