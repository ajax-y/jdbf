"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Code2, 
  ExternalLink, 
  Github, 
  Search, 
  Heart, 
  MessageSquare, 
  Share2, 
  ArrowRight,
  Layers,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProjectGalleryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:profiles(full_name, avatar_url, tier),
        likes(count),
        project_comments(count)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();

    const sub = supabase
      .channel('gallery-updates')
      .on('postgres_changes', { event: '*', table: 'projects', schema: 'public' }, fetchProjects)
      .on('postgres_changes', { event: '*', table: 'likes', schema: 'public' }, fetchProjects)
      .on('postgres_changes', { event: '*', table: 'project_comments', schema: 'public' }, fetchProjects)
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const handleLike = async (projectId: string) => {
    const userId = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
    if (!userId) return;

    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
    } else {
      await supabase.from('likes').insert([{ project_id: projectId, user_id: userId }]);
    }
  };

  const handleShare = (projectId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/projects/${projectId}`);
    alert("Project link copied to clipboard.");
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tech_stack?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#1a1c2c]/60 backdrop-blur-2xl p-8 sm:p-12 lg:p-20 rounded-[3rem] sm:rounded-[4rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white/5">
        <div className="relative z-10 flex-1 overflow-hidden">
          <Badge className="bg-primary/20 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8 sm:mb-10">Showcase Archive</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-none text-white overflow-visible">
            Project <span className="text-primary italic">Gallery.</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-slate-400 max-w-xl leading-relaxed uppercase tracking-widest">
            The decentralized archive of RIT Campus innovation. Explore the next generation of software engineering.
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-auto">
           <Link href="/projects/submit" className="w-full sm:w-auto p-1 inline-block">
              <Button className="w-full h-20 rounded-[2.5rem] px-12 font-black text-xs uppercase tracking-[0.2em] gap-4 shadow-2xl transition-all hover:scale-[1.05] active:scale-95 bg-primary text-white border-none shadow-primary/20">
                 <Plus size={24} />
                 Submit Prototype
              </Button>
           </Link>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none translate-x-1/4 translate-y-[-10%]">
           <Code2 size={600} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3 space-y-8">
           <Card className="border-none shadow-2xl bg-[#1a1c2c]/60 backdrop-blur-xl rounded-[3.5rem] p-10 overflow-hidden border border-white/5">
              <CardHeader className="p-0 mb-10">
                 <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                    <Search size={28} className="text-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                 </div>
                 <CardTitle className="text-3xl font-black text-white tracking-tight">Curation Filter</CardTitle>
                 <CardDescription className="font-bold text-slate-500 mt-2 uppercase tracking-widest text-[10px]">Refine your search across the repo</CardDescription>
              </CardHeader>
               <CardContent className="p-0 space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 block">Search Keywords</label>
                     <Input 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Search titles, stacks..." 
                       className="h-16 rounded-[1.3rem] bg-white/5 border-white/5 focus:border-primary/30 transition-all font-bold text-white pl-6" 
                     />
                  </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 block">Tech Stack</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['Web Dev', 'AI/ML', 'Mobile', 'Blockchain', 'Cybersecurity', 'Cloud'].map(tag => (
                         <button 
                           key={tag} 
                           onClick={() => setSearch(tag)}
                           className="flex items-center justify-between px-5 py-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all text-[11px] font-black text-slate-400 group text-left"
                         >
                            {tag}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-primary" />
                         </button>
                       ))}
                    </div>
                 </div>
                 <Button onClick={() => setSearch("")} variant="ghost" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border border-white/5 hover:bg-white/5 text-slate-500 hover:text-white transition-all mt-4">
                    Reset Sync
                 </Button>
              </CardContent>
           </Card>

           <div className="p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] bg-slate-950 border border-white/5 flex items-center gap-6 group hover:bg-primary transition-all duration-500 cursor-pointer text-white">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-xl">
                  <Github className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
               <div className="overflow-hidden">
                  <p className="text-sm font-black transition-colors text-white">Join Organization</p>
                  <p className="text-[10px] font-bold text-slate-300 mt-0.5 group-hover:text-white/70 transition-colors truncate">rit-geeks@github</p>
               </div>
           </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="h-full min-h-[400px] flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="h-full min-h-[600px] border border-white/5 bg-[#1a1c2c]/30 backdrop-blur-xl rounded-[4rem] flex flex-col items-center justify-center p-12 text-center space-y-10"
            >
               <div className="relative">
                  <div className="h-32 w-32 rounded-[3.5rem] bg-white/5 border border-white/5 shadow-2xl flex items-center justify-center relative z-10">
                     <Layers size={50} className="text-slate-700" />
                  </div>
               </div>
               <div className="space-y-4 max-w-sm mx-auto overflow-hidden">
                  <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Gallery Empty.</h2>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed uppercase tracking-widest text-xs">
                    No matching repositories found on this node.
                  </p>
               </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-none shadow-2xl transition-all duration-500 rounded-[3rem] bg-[#1a1c2c]/60 backdrop-blur-xl overflow-hidden border border-white/5 flex flex-col h-full group relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <div className="relative h-64 overflow-hidden bg-white/5">
                       <img 
                         src={project.image_url || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80`} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                         alt={project.title}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-[#0a0b14]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity p-8 flex items-end justify-end gap-3 translate-y-4 group-hover:translate-y-0 duration-500 transition-all">
                          <Link href={project.github_url || "#"} target="_blank">
                             <Button size="icon" className="h-12 w-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all">
                                <Github size={20} />
                             </Button>
                          </Link>
                          <Link href={project.live_url || "#"} target="_blank">
                             <Button size="icon" className="h-12 w-12 rounded-xl bg-primary text-white hover:scale-110 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
                                <ExternalLink size={20} />
                             </Button>
                          </Link>
                       </div>
                    </div>
                    <CardContent className="p-8 sm:p-10 flex-1 flex flex-col">
                       <div className="flex items-center gap-4 mb-8">
                          <Avatar className="h-12 w-12 border border-white/10 shadow-xl ring-1 ring-white/10 p-0.5 bg-[#0a0b14]">
                             <AvatarImage src={project.owner?.avatar_url} />
                             <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                {project.owner?.full_name?.charAt(0)}
                             </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-black text-white truncate tracking-tight leading-none mb-1">{project.owner?.full_name}</p>
                             <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{project.owner?.tier}</p>
                          </div>
                       </div>
 
                       <div className="space-y-4 mb-8">
                          <h3 className="text-3xl font-black text-white tracking-tighter leading-none group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-sm font-bold text-slate-500 line-clamp-2 leading-relaxed uppercase tracking-widest text-[11px]">
                             {project.description}
                          </p>
                       </div>
 
                       <div className="flex flex-wrap gap-2 mb-10 overflow-hidden">
                          {project.tech_stack?.slice(0, 3).map((lang: string) => (
                            <span key={lang} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:border-primary/20 transition-all">{lang}</span>
                          ))}
                       </div>
 
                       <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-8">
                             <button 
                               onClick={(e) => { e.preventDefault(); handleLike(project.id); }}
                               className="flex items-center gap-3 group/btn"
                             >
                                <Heart size={20} className="text-slate-700 group-hover/btn:text-rose-500 transition-colors" />
                                <span className="text-sm font-black text-slate-500 tabular-nums">{project.likes?.[0]?.count || 0}</span>
                             </button>
                             <div className="flex items-center gap-3">
                                <MessageSquare size={20} className="text-slate-700" />
                                <span className="text-sm font-black text-slate-500 tabular-nums">{project.project_comments?.[0]?.count || 0}</span>
                             </div>
                          </div>
                          <button 
                            onClick={(e) => { e.preventDefault(); handleShare(project.id); }}
                            className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-all shadow-inner"
                          >
                             <Share2 size={18} />
                          </button>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
