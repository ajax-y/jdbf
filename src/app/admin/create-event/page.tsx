"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Download, 
  Save, 
  QrCode, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from "lucide-react";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [secret, setSecret] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [fetchingEvents, setFetchingEvents] = useState(true);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateSecret = () => {
    const s = Math.random().toString(36).substring(2, 15);
    setSecret(s);
  };

  const fetchEvents = async () => {
    setFetchingEvents(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setEvents(data);
    setFetchingEvents(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    try {
      if (!secret) generateSecret();
      const eventSecret = secret || Math.random().toString(36).substring(2, 15);

      // 1. Save to Supabase
      const { data, error } = await supabase
        .from('events')
        .insert([
          { 
            title, 
            description, 
            date, 
            time, 
            location, 
            qr_secret: eventSecret,
            is_active: true 
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Add Notification for all members
      await supabase.from('notifications').insert([
        { text: `🚀 New Node Synchronized: ${title}. Join now to earn 10 merit points!`, type: 'info' }
      ]);

      setShowQR(true);
      showNotification("Session Node Synchronized Successfully!");
      fetchEvents();
    } catch (error: any) {
      showNotification(error.message || "Failed to sync node", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleEventStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      showNotification(`Node ${!currentStatus ? 'Activated' : 'Closed'}`);
      fetchEvents();
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("event-qr");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-0 relative">
      {/* Industry Level Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] w-full max-w-sm"
          >
            <div className={`mx-auto flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl border ${
              toast.type === 'success' ? 'bg-primary text-white border-primary/20' : 'bg-destructive text-white border-destructive/20'
            }`}>
               {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
               <span className="font-bold text-sm tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-16">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none">
          Create <span className="text-primary italic underline underline-offset-[12px] decoration-primary/20">Event.</span>
        </h1>
        <p className="text-slate-500 mt-10 text-xl font-bold max-w-2xl uppercase tracking-widest leading-relaxed">
          Initialize a new club session node and generate secure access tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.04)] bg-white overflow-hidden rounded-[3.5rem] border border-slate-100">
             <CardHeader className="bg-slate-50/50 p-10 sm:p-12 border-b border-slate-100">
                <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Event Configuration</CardTitle>
                <CardDescription className="font-bold text-xs text-slate-400 uppercase tracking-[0.2em]">System parameters required for deployment</CardDescription>
             </CardHeader>
             <CardContent className="p-10 sm:p-12">
                <form onSubmit={handleCreate} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Session Title</Label>
                    <Input 
                      placeholder="e.g. Next.js Masterclass" 
                      className="h-16 rounded-2xl bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/20 transition-all text-slate-900 pl-8 placeholder:text-slate-300 outline-none ring-0"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Session Date</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="date" 
                          className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/20 transition-all w-full text-slate-900 outline-none ring-0"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Start Time</Label>
                      <div className="relative group">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="time" 
                          className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/20 transition-all w-full text-slate-900 outline-none ring-0"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                   <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Location / Venue</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="CS Lab 2 / Zoom Hub" 
                        className="h-16 rounded-2xl pl-16 bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/20 transition-all text-slate-900 outline-none ring-0 placeholder:text-slate-300"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
 
                    <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Briefing Description</Label>
                     <Textarea 
                       placeholder="Detailed overview for club members..." 
                       className="min-h-[160px] rounded-[2.5rem] bg-slate-50 border-slate-100 font-bold text-lg focus:border-primary/20 transition-all p-8 text-slate-900 placeholder:text-slate-300 outline-none ring-0"
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                     />
                   </div>
 
                    <Button 
                     type="submit" 
                     disabled={isPublishing}
                     className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] gap-4 shadow-[0_20px_40px_rgba(47,141,70,0.2)] bg-primary text-white hover:bg-primary border-none transition-all hover:scale-[1.02] active:scale-95"
                   >
                     {isPublishing ? (
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                         <Save size={24} />
                       </motion.div>
                     ) : <Save size={24} />}
                     {isPublishing ? 'Synchronizing Node...' : 'Deploy & Generate QR'}
                   </Button>
                </form>
             </CardContent>
          </Card>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="lg:h-full"
        >
          <Card className={`h-full border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] transition-all duration-700 overflow-hidden relative ${showQR ? 'bg-primary text-white border-primary/20' : 'bg-white border-dashed'} rounded-[3.5rem]`}>
             <CardHeader className="p-10 text-center relative z-10">
                <CardTitle className={`text-3xl font-black tracking-tight leading-none mb-3 ${showQR ? 'text-white' : 'text-slate-900'}`}>Access Signal</CardTitle>
                <CardDescription className={`font-bold text-xs uppercase tracking-[0.2em] mt-3 ${showQR ? 'text-white/70' : 'text-slate-400'}`}>
                  {showQR ? 'Verified secure token' : 'Awaiting system deployment'}
                </CardDescription>
             </CardHeader>
             <CardContent className="p-10 flex flex-col items-center justify-center min-h-[550px] relative z-10">
                {showQR ? (
                  <motion.div 
                    initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-10"
                  >
                    <div className="p-8 bg-white rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] ring-4 ring-white/20">
                      <QRCodeSVG 
                        id="event-qr"
                        value={JSON.stringify({ id: events[0]?.id || '', secret, title })} 
                        size={320}
                        fgColor="#2f8d46"
                        level="H"
                        includeMargin
                        imageSettings={{
                          src: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
                          height: 60,
                          width: 60,
                          excavate: true,
                        }}
                      />
                    </div>
                    
                    <div className="text-center space-y-6">
                       <p className="text-base font-bold opacity-90 max-w-[320px] leading-relaxed">
                         Present this token during the session. Automated verification will be live on the wall.
                       </p>
                       <div className="flex flex-col sm:flex-row gap-4 w-full">
                         <Button 
                           variant="secondary"
                           onClick={downloadQR}
                           className="flex-1 rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-xl bg-white text-slate-900 border-none hover:bg-slate-100"
                         >
                           <Download size={18} />
                           Export PNG
                         </Button>
                         <Link href={`/admin/live-wall/${title.replace(/\s+/g, '-').toLowerCase()}`} className="flex-1 w-full">
                           <Button 
                             className="w-full rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-xl bg-slate-900 text-white border-none hover:bg-slate-950"
                           >
                             <Play size={18} fill="currentColor" />
                             Join Stream
                           </Button>
                         </Link>
                       </div>
                    </div>
                  </motion.div>
                 ) : (
                   <div className="text-center space-y-10">
                     <div className="h-48 w-48 rounded-[3.5rem] bg-slate-50 flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                        <QrCode size={90} className="text-slate-200 animate-pulse" />
                     </div>
                     <p className="font-black text-slate-400 text-xs uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-relaxed">Initialize node configuration to start</p>
                   </div>
                 )}
             </CardContent>

             {/* Background Decoration */}
             {showQR && (
               <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                   transition={{ duration: 20, repeat: Infinity }}
                   className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-white blur-[100px] rounded-full"
                 />
               </div>
             )}
          </Card>
        </motion.div>
      </div>
      <div className="mt-24 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Node <span className="text-primary italic">Archives.</span></h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">Verified session registry across the cluster</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {fetchingEvents ? (
             <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
           ) : events.map((event) => (
             <Card key={event.id} className="border-none shadow-[0_20px_60px_rgba(0,0,0,0.03)] bg-white rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all border border-slate-100">
                <CardHeader className="p-8 pb-0">
                   <div className="flex justify-between items-start">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${event.is_active ? 'bg-primary/5 text-primary' : 'bg-slate-100 text-slate-400'} border border-slate-100`}>
                         <QrCode size={22} />
                      </div>
                      <Badge className={`${event.is_active ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 text-slate-500 border-slate-200'} font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full border`}>
                         {event.is_active ? 'Active Signal' : 'Closed Node'}
                      </Badge>
                   </div>
                </CardHeader>
                <CardContent className="p-8">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-slate-500">
                         <Calendar size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                         <MapPin size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest truncate">{event.location}</span>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <Button 
                        onClick={() => toggleEventStatus(event.id, event.is_active)}
                        variant={event.is_active ? "destructive" : "default"}
                        className="flex-1 rounded-[1.2rem] h-12 font-black text-[10px] uppercase tracking-widest"
                      >
                         {event.is_active ? 'Close Node' : 'Activate Node'}
                      </Button>
                      <Button 
                        onClick={() => {
                          setTitle(event.title);
                          setDate(event.date);
                          setTime(event.time);
                          setLocation(event.location);
                          setSecret(event.qr_secret);
                          setShowQR(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        variant="ghost" 
                        className="rounded-[1.2rem] h-12 w-12 p-0 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary"
                      >
                         <QrCode size={18} />
                      </Button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
