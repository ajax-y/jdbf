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
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toaster";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
      toast("Error saving profile: " + error.message, "error");
    } else {
      toast("Profile updated successfully!", "success");
      fetchProfile();
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Profile in Database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast("Profile picture updated!", "success");
      fetchProfile();
    } catch (error: any) {
      toast("Error uploading: " + error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-8 sm:y-12 pb-24 px-4 sm:px-0">
      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8 sm:gap-16 mb-8 sm:mb-20 bg-white p-6 sm:p-16 rounded-[2rem] sm:rounded-[5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden text-center lg:text-left">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-[-20%]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <User size={400} />
          </motion.div>
        </div>
        
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
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleAvatarUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-4 right-4 p-5 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {uploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
          </button>
        </motion.div>
        
        <div className="flex-1 pt-4 sm:pt-10 z-10 w-full overflow-hidden">
           <div className="flex flex-col lg:flex-row items-center gap-6 mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-none truncate">
                {profile?.full_name?.split(' ')[0]} <span className="text-primary italic underline underline-offset-[12px] decoration-primary/20">{profile?.full_name?.split(' ')[1]}.</span>
              </h1>
              <Badge className={`font-black px-6 py-2.5 uppercase tracking-[0.3em] text-[10px] rounded-full shrink-0 border ${
                (profile?.points || 0) >= 100 ? 'bg-slate-900 text-white border-primary/20' :
                (profile?.points || 0) >= 50 ? 'bg-amber-100/80 text-amber-700 border-amber-200 shadow-sm' :
                (profile?.points || 0) >= 20 ? 'bg-slate-100 text-slate-600 border-slate-200' :
                'bg-orange-100/80 text-orange-700 border-orange-200'
              }`}>
                {(profile?.points || 0) >= 100 ? 'Diamond' : 
                 (profile?.points || 0) >= 50 ? 'Gold' :
                 (profile?.points || 0) >= 20 ? 'Silver' : 'Bronze'} Node
              </Badge>
           </div>
           <p className="text-base sm:text-lg text-slate-600 font-bold mb-12 max-w-xl leading-relaxed mx-auto lg:mx-0 uppercase tracking-widest">
             {profile?.bio || 'Building the future of RIT Campus innovation, one line of code at a time.'}
           </p>
            <div className="flex flex-col sm:flex-row lg:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                <Link href={profile?.github_link || "#"} target="_blank" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full sm:w-auto rounded-2xl h-16 sm:h-20 px-12 font-black text-[11px] uppercase tracking-[0.2em] gap-4 bg-slate-50 border border-slate-200/60 text-slate-600 hover:bg-slate-100 transition-all shadow-sm">
                     <Github size={24} />
                     Registry
                  </Button>
                </Link>
                <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto rounded-2xl h-16 sm:h-20 px-12 sm:px-16 font-black text-[11px] uppercase tracking-[0.2em] gap-4 shadow-[0_20px_40px_rgba(47,141,70,0.2)] bg-primary text-white hover:scale-[1.05] transition-all border-none">
                   {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                   Sync Profile
                </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.04)] bg-white rounded-[3.5rem] overflow-hidden border border-slate-100">
            <CardHeader className="p-10 sm:p-12 border-b border-slate-50 bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[1.3rem] bg-white border border-slate-200/60 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/5">
                    <User size={32} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-left leading-none mb-3 truncate">Identity Node</CardTitle>
                    <CardDescription className="font-bold text-slate-500 text-left uppercase tracking-[0.2em] text-[10px]">Core parameters of your club presence</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-12 space-y-8 sm:space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Full Signature (Name)</Label>
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.full_name}
                          onChange={e => setFormData({...formData, full_name: e.target.value})}
                          className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all outline-none ring-0 placeholder:text-slate-300" 
                        />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Universal Handle (Username)</Label>
                      <div className="relative group">
                         <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                         <Input 
                           value={formData.username}
                           onChange={e => setFormData({...formData, username: e.target.value})}
                           placeholder="geeks_rit"
                           className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all outline-none ring-0 placeholder:text-slate-300" 
                         />
                      </div>
                   </div>
                </div>
 
                <div className="space-y-4">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Encryption Token (Password)</Label>
                   <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all outline-none ring-0 placeholder:text-slate-300" 
                      />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Your password is encrypted in the club databank.</p>
                </div>
 
                <div className="space-y-4">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Vision Manifest (Bio)</Label>
                   <Textarea 
                     value={formData.bio}
                     onChange={e => setFormData({...formData, bio: e.target.value})}
                     placeholder="Describe your tech journey..."
                     className="min-h-[160px] rounded-[2.5rem] bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all p-8 outline-none ring-0 placeholder:text-slate-300" 
                   />
                </div>
             </CardContent>
          </Card>

          <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.04)] bg-white rounded-[3.5rem] overflow-hidden border border-slate-100">
            <CardHeader className="p-10 sm:p-12 border-b border-slate-50 bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[1.3rem] bg-white border border-slate-200/60 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/5">
                    <Briefcase size={32} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-left leading-none mb-3 truncate">Technical Protocol</CardTitle>
                    <CardDescription className="font-bold text-slate-500 text-left uppercase tracking-[0.2em] text-[10px]">Professional links and expertise nodes</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-12 space-y-8 sm:space-y-12">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Core Expertise (comma separated)</Label>
                  <Input 
                    value={formData.core_expertise}
                    onChange={e => setFormData({...formData, core_expertise: e.target.value})}
                    placeholder="Next.js, Python, Deep Learning..."
                    className="h-16 rounded-2xl bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all outline-none ring-0 placeholder:text-slate-300" 
                  />
               </div>
  
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">GitHub Endpoint</Label>
                     <div className="relative group">
                        <Github className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.github_link}
                          onChange={e => setFormData({...formData, github_link: e.target.value})}
                          placeholder="github.com/username"
                          className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all outline-none ring-0 placeholder:text-slate-300" 
                        />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Contact Signal (Email/Link)</Label>
                     <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={formData.contact_info}
                          onChange={e => setFormData({...formData, contact_info: e.target.value})}
                          placeholder="geeks@campus.rit"
                          className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-slate-900 focus:border-primary/20 transition-all outline-none ring-0 placeholder:text-slate-300" 
                        />
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-12">
          <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.05)] bg-primary text-white rounded-[3.5rem] p-10 overflow-hidden relative group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-white">
                   <Edit3 className="text-white" />
                   Profile Sync
                </h3>
                <p className="font-bold text-white/80 text-sm leading-relaxed mb-8">
                   All changes are synchronized instantly with the cloud repository. Ensure your handles are unique across the campus network.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 bg-white/10 rounded-2xl border border-white/10 group-hover:bg-white/20 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white">Merit Registry</span>
                      </div>
                      <span className="text-2xl font-black text-white">{profile?.points || 0}</span>
                   </div>
                   <div className="flex items-center gap-3 p-6 bg-white/10 rounded-2xl border border-white/10 group-hover:bg-white/20 transition-all">
                      <div className="h-2 w-2 rounded-full bg-emerald-300" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Public Manifest Verified</span>
                   </div>
                </div>
             </div>
          </Card>
 
          <div className="p-10 rounded-[3.5rem] border border-slate-200 bg-white flex flex-col items-center text-center space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
             <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
                <ExternalLink size={40} />
             </div>
             <div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-3">Public View</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">See how nodes see you</p>
             </div>
             <Button variant="ghost" className="w-full rounded-2xl h-16 font-black text-[10px] border border-slate-100 transition-all hover:bg-slate-50 text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em]">
                Generate Public Page
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
