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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-slate-900 p-8 sm:p-12 lg:p-20 rounded-[3rem] sm:rounded-[4rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden">
        <div className="relative z-10 flex-1 overflow-hidden">
          <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 sm:mb-8">Showcase</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-4 sm:mb-6 leading-none text-white">
            Project <span className="text-primary italic">Gallery.</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-slate-400 max-w-xl leading-relaxed">
            The decentralized archive of RIT Campus innovation. Explore the next generation of software engineering.
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-auto">
           <Link href="/projects/submit" className="w-full sm:w-auto border border-white/10 rounded-[2.5rem] p-1 inline-block">
              <Button className="w-full h-16 rounded-[2.2rem] px-10 font-black text-xs uppercase tracking-widest gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 bg-white text-slate-900 border-none transition-colors">
                 <Plus size={18} />
                 Submit Prototype
              </Button>
           </Link>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none translate-x-1/4 translate-y-[-1/4]">
           <Code2 size={400} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3 space-y-8">
           <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] p-10 overflow-hidden border border-slate-50">
              <CardHeader className="p-0 mb-10">
                 <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Search size={28} className="text-primary" />
                 </div>
                 <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Curation Filter</CardTitle>
                 <CardDescription className="font-bold text-slate-500 mt-1">Refine your search across the repo</CardDescription>
              </CardHeader>
               <CardContent className="p-0 space-y-6 sm:y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 block">Search Keywords</label>
                     <Input 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Search titles, stacks..." 
                       className="h-12 sm:h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm" 
                     />
                  </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 block">Tech Stack</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['Web Dev', 'AI/ML', 'Mobile', 'Blockchain', 'Cybersecurity', 'Cloud'].map(tag => (
                         <button 
                           key={tag} 
                           onClick={() => setSearch(tag)}
                           className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-[11px] font-black text-slate-600 group"
                         >
                            {tag}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                         </button>
                       ))}
                    </div>
                 </div>
                 <Button onClick={() => setSearch("")} variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 mt-4">
                    Reset Sync
                 </Button>
              </CardContent>
           </Card>

           <div className="p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] bg-slate-950 border border-white/5 flex items-center gap-6 group hover:bg-primary transition-all duration-500 cursor-pointer text-white">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-xl">
                  <Github className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-black transition-colors">Join Organization</p>
                 <p className="text-[10px] font-bold text-slate-400 mt-0.5 group-hover:text-white/70 transition-colors truncate">rit-geeks@github</p>
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
               className="h-full min-h-[600px] border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center p-12 text-center space-y-10"
            >
               <div className="relative">
                  <div className="h-32 w-32 rounded-[3.5rem] bg-white shadow-2xl flex items-center justify-center ring-1 ring-slate-100 relative z-10">
                     <Layers size={50} className="text-slate-200" />
                  </div>
               </div>
               <div className="space-y-4 max-w-sm mx-auto">
                  <h2 className="text-4xl font-black text-slate-950 tracking-tight leading-tight">The gallery is waiting.</h2>
                  <p className="text-slate-400 font-bold text-lg leading-relaxed">
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
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[3rem] bg-white overflow-hidden border border-slate-50 flex flex-col h-full group">
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                       <img 
                         src={project.image_url || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80`} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         alt={project.title}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end justify-end gap-3">
                          <Link href={project.github_url || "#"} target="_blank">
                             <Button size="icon" className="rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all">
                                <Github size={18} />
                             </Button>
                          </Link>
                          <Link href={project.live_url || "#"} target="_blank">
                             <Button size="icon" className="rounded-xl bg-primary text-white hover:scale-110 transition-all">
                                <ExternalLink size={18} />
                             </Button>
                          </Link>
                       </div>
                    </div>
                    <CardContent className="p-8 flex-1 flex flex-col">
                       <div className="flex items-center gap-3 mb-6">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                             <AvatarImage src={project.owner?.avatar_url} />
                             <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                {project.owner?.full_name?.charAt(0)}
                             </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 overflow-hidden">
                             <p className="text-xs font-black text-slate-900 truncate tracking-tight">{project.owner?.full_name}</p>
                             <p className="text-[8px] font-black uppercase text-primary tracking-[0.2em] mt-0.5">{project.owner?.tier}</p>
                          </div>
                       </div>

                       <div className="space-y-3 mb-8">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-sm font-bold text-slate-500 line-clamp-2 leading-relaxed">
                             {project.description}
                          </p>
                       </div>

                       <div className="flex flex-wrap gap-2 mb-8">
                          {project.tech_stack?.slice(0, 3).map((lang: string) => (
                            <span key={lang} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">{lang}</span>
                          ))}
                       </div>

                       <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <button 
                               onClick={() => handleLike(project.id)}
                               className="flex items-center gap-2 group/btn"
                             >
                                <Heart size={18} className="text-slate-300 group-hover/btn:text-rose-500 transition-colors" />
                                <span className="text-xs font-black text-slate-500">{project.likes?.[0]?.count || 0}</span>
                             </button>
                             <div className="flex items-center gap-2">
                                <MessageSquare size={18} className="text-slate-300" />
                                <span className="text-xs font-black text-slate-500">{project.project_comments?.[0]?.count || 0}</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleShare(project.id)}
                            className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                          >
                             <Share2 size={16} />
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
