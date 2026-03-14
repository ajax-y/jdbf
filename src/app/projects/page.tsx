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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-white p-10 sm:p-16 lg:p-24 rounded-[3.5rem] text-slate-900 shadow-[0_40px_80px_rgba(0,0,0,0.05)] relative overflow-hidden border border-slate-200/50">
        <div className="relative z-10 flex-1 overflow-hidden">
          <Badge className="bg-primary/10 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-[0.4em] px-6 py-2.5 rounded-full mb-10 translate-y-[-10px] block w-fit">Showcase Archive</Badge>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-10 leading-none text-slate-900">
            Project <span className="text-primary italic underline underline-offset-[16px] decoration-primary/20">Gallery.</span>
          </h1>
          <p className="text-xl font-bold text-slate-500 max-w-xl leading-relaxed uppercase tracking-widest text-sm sm:text-base">
            The decentralized archive of RIT Campus innovation. Explore the next generation of software engineering.
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-auto">
           <Link href="/projects/submit" className="w-full sm:w-auto p-1 inline-block">
              <Button className="w-full h-24 rounded-[3rem] px-16 font-black text-xs uppercase tracking-[0.3em] gap-5 shadow-[0_30px_60px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.05] active:scale-95 bg-primary text-white border-none">
                 <Plus size={28} />
                 Initialize Prototype
              </Button>
           </Link>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-[-10%]">
           <Code2 size={600} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3 space-y-8">
           <Card className="border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white rounded-[3.5rem] p-10 overflow-hidden border border-slate-100">
              <CardHeader className="p-0 mb-10">
                 <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-8 shadow-sm">
                    <Search size={28} className="text-primary" />
                 </div>
                 <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Curation Filter</CardTitle>
                 <CardDescription className="font-bold text-slate-400 mt-2 uppercase tracking-widest text-[10px]">Refine your search across the repo</CardDescription>
              </CardHeader>
               <CardContent className="p-0 space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 block">Search Keywords</label>
                     <Input 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Search titles, stacks..." 
                       className="h-16 rounded-[1.5rem] bg-slate-50 border-slate-100 focus:border-primary/20 transition-all font-bold text-slate-900 pl-6 placeholder:text-slate-300 ring-0 focus-visible:ring-0" 
                     />
                  </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 block">Tech Stack</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['Web Dev', 'AI/ML', 'Mobile', 'Blockchain', 'Cybersecurity', 'Cloud'].map(tag => (
                         <button 
                           key={tag} 
                           onClick={() => setSearch(tag)}
                           className="flex items-center justify-between px-5 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black text-slate-500 group text-left"
                         >
                            {tag}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-primary" />
                         </button>
                       ))}
                    </div>
                 </div>
                 <Button onClick={() => setSearch("")} variant="ghost" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all mt-4">
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
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full min-h-[600px] border border-slate-100 bg-white rounded-[4rem] flex flex-col items-center justify-center p-16 text-center space-y-12 shadow-[0_40px_80px_rgba(0,0,0,0.03)]"
            >
               <div className="relative">
                  <div className="h-40 w-40 rounded-[4rem] bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center relative z-10 transition-transform hover:scale-110 duration-500">
                     <Layers size={50} className="text-slate-200" />
                  </div>
               </div>
               <div className="space-y-6 max-w-sm mx-auto overflow-hidden">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Gallery Empty.</h2>
                  <p className="text-slate-400 font-bold text-lg leading-relaxed uppercase tracking-[0.3em] text-xs">
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
                  <Card className="border-none shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-700 rounded-[3.5rem] bg-white overflow-hidden border border-slate-100 flex flex-col h-full group relative hover:translate-y-[-12px]">
                    <div className="p-8 sm:p-10 flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <Avatar className="h-14 w-14 border-4 border-slate-50 shadow-md p-1 bg-white">
                             <AvatarImage src={project.owner?.avatar_url} />
                             <AvatarFallback className="bg-primary/10 text-primary text-sm font-black">
                                {project.owner?.full_name?.charAt(0)}
                             </AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                             <p className="text-base font-black text-slate-900 truncate tracking-tight leading-none mb-1.5">{project.owner?.full_name}</p>
                             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">{project.owner?.tier} Node</p>
                          </div>
                       </div>
                       <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                       </div>
                    </div>

                    <div className="relative h-[28rem] overflow-hidden bg-primary flex items-center justify-center px-10 text-center m-1 rounded-[2.5rem] group-hover:m-0 group-hover:rounded-none transition-all duration-700">
                       <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 opacity-90 transition-all duration-700 group-hover:scale-110" />
                       {/* SVG Vector Background Deco */}
                       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
                       
                       <div className="relative z-10 space-y-8">
                          <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase hyphens-auto break-words">
                            {project.title}
                          </h3>
                          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Innovation Handshake</span>
                          </div>
                       </div>

                       <div className="absolute bottom-8 right-8 flex gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          <Link href={project.github_url || "#"} target="_blank">
                             <Button size="icon" className="h-14 w-14 rounded-2xl bg-white text-primary border-none shadow-2xl hover:scale-110 transition-all">
                                <Github size={24} />
                             </Button>
                          </Link>
                          <Link href={project.live_url || "#"} target="_blank">
                             <Button size="icon" className="h-14 w-14 rounded-2xl bg-white text-primary border-none shadow-2xl hover:scale-110 transition-all">
                                <ExternalLink size={24} />
                             </Button>
                          </Link>
                       </div>
                    </div>

                    <CardContent className="p-8 sm:p-10 flex-1 flex flex-col">
                       <div className="flex items-center justify-between mb-8 overflow-hidden">
                          <div className="flex items-center gap-6">
                             <button className="text-slate-900 hover:text-primary transition-colors active:scale-90" onClick={() => handleLike(project.id)}>
                                <Heart size={28} className={project.likes?.length > 0 ? "fill-primary text-primary" : ""} />
                             </button>
                             <button className="text-slate-900 hover:text-primary transition-colors active:scale-90">
                                <MessageSquare size={28} />
                             </button>
                             <button className="text-slate-900 hover:text-primary transition-colors active:scale-90" onClick={() => handleShare(project.id)}>
                                <Share2 size={28} />
                             </button>
                          </div>
                          <button className="text-slate-900 transition-transform active:scale-90">
                             <div className="h-10 w-8 border-2 border-slate-900 rounded-sm relative flex items-center justify-center">
                                <div className="absolute top-0 right-0 w-2 h-2 border-b-2 border-l-2 border-slate-900" />
                             </div>
                          </button>
                       </div>

                       <div className="space-y-4">
                          <p className="text-base font-black text-slate-900 leading-tight">
                            {project.likes?.[0]?.count || 0} likes
                          </p>
                          <p className="text-sm font-bold text-slate-700 line-clamp-2 leading-relaxed tracking-tight">
                             <span className="font-black mr-2">{project.owner?.full_name}</span>
                             {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                             {project.tech_stack?.slice(0, 3).map((lang: string) => (
                               <span key={lang} className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">#{lang.replace(/\s+/g, '')}</span>
                             ))}
                          </div>
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
