"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Github, 
  Mail, 
  Edit3, 
  Camera, 
  Save, 
  Loader2, 
  Lock, 
  AtSign, 
  Briefcase,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    bio: "",
    core_expertise: "",
    github_link: "",
    contact_info: ""
  });

  const fetchProfile = async () => {
    const userId = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
    if (!userId) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        username: data.username || "",
        password: data.password || "",
        bio: data.bio || "",
        core_expertise: data.core_expertise || "",
        github_link: data.github_link || "",
        contact_info: data.contact_info || ""
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', profile.id);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
      fetchProfile();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-12 pb-24">
      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8 sm:gap-12 mb-10 sm:mb-16 bg-white p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] shadow-xl border border-slate-50 relative overflow-hidden text-center lg:text-left">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group z-10"
        >
          <Avatar className="h-40 w-40 sm:h-56 sm:w-56 border-[6px] sm:border-[8px] border-white shadow-2xl transition-all duration-500 group-hover:scale-105">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-4xl sm:text-6xl font-black bg-slate-50 text-primary">
              {profile?.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-4 right-4 p-5 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-primary/30">
             <Camera size={24} />
          </button>
        </motion.div>
        
        <div className="flex-1 pt-4 sm:pt-6 z-10 w-full overflow-hidden">
           <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-none truncate">
                {profile?.full_name?.split(' ')[0]} <span className="text-primary italic underline underline-offset-8 decoration-primary/10">{profile?.full_name?.split(' ')[1]}.</span>
              </h1>
              <Badge className="bg-primary/10 text-primary border-none font-black px-5 py-2 uppercase tracking-[0.2em] text-[10px] rounded-full shrink-0">
                {profile?.tier || 'Member'}
              </Badge>
           </div>
           <p className="text-base sm:text-lg lg:text-xl text-slate-500 font-bold mb-8 sm:mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
             {profile?.bio || 'Building the future of RIT Campus innovation, one line of code at a time.'}
           </p>
            <div className="flex flex-col sm:flex-row lg:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
               <Link href={profile?.github_link || "#"} target="_blank" className="w-full sm:w-auto">
                 <Button variant="outline" className="w-full sm:w-auto rounded-2xl h-12 sm:h-14 px-6 sm:px-8 font-black text-[10px] uppercase tracking-widest gap-3 border-2 border-slate-100 hover:bg-slate-50 hover:text-primary transition-all shadow-sm">
                    <Github size={18} />
                    Registry
                 </Button>
               </Link>
               <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto rounded-2xl h-12 sm:h-14 px-8 sm:px-10 font-black text-[10px] uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 bg-primary text-white hover:scale-105 transition-all">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Sync Profile
               </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-slate-50">
            <CardHeader className="p-6 sm:p-10 border-b border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-left">Identity Node</CardTitle>
                    <CardDescription className="font-bold text-slate-400 text-left">Core parameters of your club presence</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Full Signature (Name)</Label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.full_name}
                          onChange={e => setFormData({...formData, full_name: e.target.value})}
                          className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Universal Handle (Username)</Label>
                     <div className="relative group">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.username}
                          onChange={e => setFormData({...formData, username: e.target.value})}
                          placeholder="geeks_rit"
                          className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Encryption Token (Password)</Label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                     <Input 
                       type="password"
                       value={formData.password}
                       onChange={e => setFormData({...formData, password: e.target.value})}
                       className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                     />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 ml-1">Your password is encrypted in the club databank.</p>
               </div>

               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Vision Manifest (Bio)</Label>
                  <Textarea 
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe your tech journey..."
                    className="min-h-[140px] rounded-[2rem] bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all p-6" 
                  />
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-slate-50">
            <CardHeader className="p-6 sm:p-10 border-b border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-left">Technical Protocol</CardTitle>
                    <CardDescription className="font-bold text-slate-400 text-left">Professional links and expertise nodes</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-10">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Core Expertise (comma separated)</Label>
                  <Input 
                    value={formData.core_expertise}
                    onChange={e => setFormData({...formData, core_expertise: e.target.value})}
                    placeholder="Next.js, Python, Deep Learning..."
                    className="h-14 rounded-2xl bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all p-6" 
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">GitHub Endpoint</Label>
                     <div className="relative group">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.github_link}
                          onChange={e => setFormData({...formData, github_link: e.target.value})}
                          placeholder="github.com/username"
                          className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Contact Signal (Email/Link)</Label>
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.contact_info}
                          onChange={e => setFormData({...formData, contact_info: e.target.value})}
                          placeholder="geeks@campus.rit"
                          className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-12">
          <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3.5rem] p-10 overflow-hidden relative group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                   <Edit3 className="text-primary" />
                   Profile Sync
                </h3>
                <p className="font-bold text-slate-400 text-sm leading-relaxed mb-8">
                   All changes are synchronized instantly with the cloud repository. Ensure your handles are unique across the campus network.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Encryption Active</span>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Public Manifest Verified</span>
                   </div>
                </div>
             </div>
          </Card>

          <div className="p-10 rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6">
             <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                <ExternalLink size={32} />
             </div>
             <div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Public View</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">See how nodes see you</p>
             </div>
             <Button variant="outline" className="w-full rounded-2xl h-12 font-black text-[10px] border-2 border-slate-50 transition-all hover:bg-slate-50">
                Generate Public Page
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
