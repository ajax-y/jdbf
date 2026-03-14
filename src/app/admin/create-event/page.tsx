"use client";

import { useState } from "react";
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
import { Calendar, MapPin, Download, Save, QrCode, Play, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateSecret = () => {
    const s = Math.random().toString(36).substring(2, 15);
    setSecret(s);
  };

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

      // 2. Add Notification in Cloud
      await supabase.from('notifications').insert([
        { text: `New Event Created: ${title}`, type: 'success' }
      ]);

      setShowQR(true);
      showNotification("Session Node Synchronized Successfully!");
    } catch (error: any) {
      showNotification(error.message || "Failed to sync node", "error");
    } finally {
      setIsPublishing(false);
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
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
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
          <Card className="border-none shadow-2xl bg-[#1a1c2c]/60 backdrop-blur-xl overflow-hidden rounded-[3.5rem] border border-white/5">
             <CardHeader className="bg-white/5 p-10 sm:p-12 border-b border-white/5">
                <CardTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-3">Event Configuration</CardTitle>
                <CardDescription className="font-bold text-xs text-slate-500 uppercase tracking-[0.2em]">System parameters required for deployment</CardDescription>
             </CardHeader>
             <CardContent className="p-10 sm:p-12">
                <form onSubmit={handleCreate} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Session Title</Label>
                    <Input 
                      placeholder="e.g. Next.js Masterclass" 
                      className="h-16 rounded-2xl bg-white/5 border-white/5 font-bold text-lg focus:border-primary/30 transition-all text-white pl-8"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Session Date</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 pointer-events-none group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="date" 
                          className="h-16 rounded-2xl pl-16 bg-white/5 border-white/5 font-bold text-lg focus:border-primary/30 transition-all w-full text-white"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">Start Time</Label>
                      <div className="relative group">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 pointer-events-none group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="time" 
                          className="h-16 rounded-2xl pl-16 bg-white/5 border-white/5 font-bold text-lg focus:border-primary/30 transition-all w-full text-white"
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
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 pointer-events-none group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="CS Lab 2 / Zoom Hub" 
                        className="h-16 rounded-2xl pl-16 bg-white/5 border-white/5 font-bold text-lg focus:border-primary/30 transition-all text-white"
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
                      className="min-h-[160px] rounded-[2.5rem] bg-white/5 border-white/5 font-bold text-lg focus:border-primary/30 transition-all p-8 text-white"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
 
                   <Button 
                    type="submit" 
                    disabled={isPublishing}
                    className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] gap-4 shadow-2xl shadow-primary/20 bg-primary text-white hover:bg-primary border-none transition-all hover:scale-[1.02] active:scale-95"
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
          <Card className={`h-full border border-white/5 shadow-2xl transition-all duration-700 overflow-hidden relative ${showQR ? 'bg-primary text-white' : 'bg-[#1a1c2c]/60 backdrop-blur-xl border-dashed'} rounded-[3.5rem]`}>
             <CardHeader className="p-10 text-center relative z-10">
                <CardTitle className={`text-3xl font-black tracking-tight leading-none mb-3 ${showQR ? 'text-white' : 'text-white/50'}`}>Access Signal</CardTitle>
                <CardDescription className={`font-bold text-xs uppercase tracking-[0.2em] mt-3 ${showQR ? 'text-white/70' : 'text-slate-600'}`}>
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
                        value={JSON.stringify({ title, date, time, secret, location })} 
                        size={320}
                        fgColor="#2f8d46"
                        level="H"
                        includeMargin
                        imageSettings={{
                          src: "/logo.png",
                          x: undefined,
                          y: undefined,
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
                     <div className="h-48 w-48 rounded-[3.5rem] bg-white/5 shadow-2xl flex items-center justify-center mx-auto border border-white/5 ring-1 ring-white/5">
                        <QrCode size={90} className="text-slate-800 animate-pulse" />
                     </div>
                     <p className="font-black text-slate-600 text-xs uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-relaxed">Initialize node configuration to start</p>
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
    </div>
  );
}
