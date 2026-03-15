"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Code2, 
  Calendar, 
  Star, 
  Github, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  User,
  Loader2
} from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (data) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 space-y-6">
        <div className="h-24 w-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
           <User size={48} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Node Not Found</h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">The requested user node does not exist in the cluster.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-12 sm:pt-20 px-4 relative z-10">
        <div className="bg-white rounded-[3.5rem] sm:rounded-[5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
           <div className="h-48 sm:h-64 bg-slate-900 relative">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent" />
           </div>
           
           <div className="px-8 sm:px-16 pb-16 -mt-24 sm:-mt-32">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 mb-12">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                 >
                    <Avatar className="h-48 w-48 sm:h-64 sm:w-64 border-[10px] border-white shadow-2xl">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-6xl font-black bg-slate-50 text-primary">
                        {profile.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                 </motion.div>
                 
                 <div className="flex-1 text-center lg:text-left pb-4">
                    <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                       <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900">
                         {profile.full_name}
                       </h1>
                       <Badge className={`font-black px-6 py-2.5 uppercase tracking-[0.3em] text-[10px] rounded-full border ${
                          (profile.points || 0) >= 100 ? 'bg-slate-900 text-white border-primary/20' :
                          (profile.points || 0) >= 50 ? 'bg-amber-100/80 text-amber-700 border-amber-200 shadow-sm' :
                          (profile.points || 0) >= 20 ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          'bg-orange-100/80 text-orange-700 border-orange-200'
                        }`}>
                          {(profile.points || 0) >= 100 ? 'Diamond' : 
                          (profile.points || 0) >= 50 ? 'Gold' :
                          (profile.points || 0) >= 20 ? 'Silver' : 'Bronze'} Node
                       </Badge>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">@{profile.username || 'member_node'}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Mission Manifest</h3>
                       <p className="text-xl sm:text-2xl text-slate-600 font-bold leading-relaxed">
                         {profile.bio || 'Building the future of RIT Campus innovation, one line of code at a time.'}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                       {[
                         { label: "Merit Points", value: profile.points || 0, icon: Star, color: "text-amber-500" },
                         { label: "Sync Count", value: profile.attendance_count || 0, icon: Calendar, color: "text-blue-500" },
                         { label: "Manifests", value: profile.project_count || 0, icon: Code2, color: "text-emerald-500" },
                         { label: "Global Rank", value: profile.rank || "#12", icon: Trophy, color: "text-purple-500" },
                       ].map((stat) => (
                         <div key={stat.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3 group hover:border-primary/20 transition-all">
                            <stat.icon size={20} className={`${stat.color} mx-auto group-hover:scale-110 transition-transform`} strokeWidth={2.5} />
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                         </div>
                       ))}
                    </div>

                    <div className="space-y-8 p-10 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group">
                       <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                          <div>
                             <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Masterpiece</Badge>
                             <h4 className="text-2xl font-black text-white tracking-tight">{profile.featured_project || 'Aurora Engine'}</h4>
                             <p className="text-slate-400 font-bold text-sm mt-3">Featured construction node in the personal gallery.</p>
                          </div>
                          <Code2 size={64} className="text-white/5 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-700" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="p-10 rounded-[2.5rem] border border-slate-200 bg-white space-y-8 shadow-sm">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Signal Endpoints</h3>
                       <div className="space-y-4">
                          <a href={profile.github_link} target="_blank" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <Github size={20} />
                             </div>
                             <span className="text-sm font-black text-slate-600 uppercase tracking-widest">Registry</span>
                          </a>
                          <a href={`mailto:${profile.contact_info}`} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <Mail size={20} />
                             </div>
                             <span className="text-sm font-black text-slate-600 uppercase tracking-widest">Contact</span>
                          </a>
                       </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-primary text-white text-center space-y-6">
                       <ShieldCheck size={48} className="mx-auto text-white/50" />
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest text-white/70">Verified Member</p>
                          <p className="text-sm font-bold mt-2">Authenticated node in the GfG RIT Campus Network.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
