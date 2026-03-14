"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
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
import { Calendar, MapPin, Download, Save, QrCode, Play } from "lucide-react";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [secret, setSecret] = useState("");
  const [showQR, setShowQR] = useState(false);

  const generateSecret = () => {
    const s = Math.random().toString(36).substring(2, 15);
    setSecret(s);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) generateSecret();
    setShowQR(true);
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
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter">
          Create <span className="text-primary">Event.</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Configure your club session and generate a secure entry QR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-card overflow-hidden">
             <CardHeader className="bg-muted/30 p-8 border-b border-border/10">
                <CardTitle className="text-2xl font-black">Event Configuration</CardTitle>
                <CardDescription>All fields are required for generation</CardDescription>
             </CardHeader>
             <CardContent className="p-8">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60">Event Title</Label>
                    <Input 
                      placeholder="e.g. Next.js Masterclass" 
                      className="h-12 rounded-xl"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest opacity-60">Date & Time</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <Input 
                          type="datetime-local" 
                          className="h-12 rounded-xl pl-10"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest opacity-60">Venue</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <Input 
                          placeholder="CS Lab 2" 
                          className="h-12 rounded-xl pl-10"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60">Description</Label>
                    <Textarea 
                      placeholder="What will happen in this session?" 
                      className="min-h-[120px] rounded-xl"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
                    <Save size={18} />
                    Publish & Generate QR
                  </Button>
                </form>
             </CardContent>
          </Card>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={`h-full border-none shadow-xl transition-all duration-500 overflow-hidden ${showQR ? 'bg-primary text-primary-foreground' : 'bg-muted/30 border-2 border-dashed border-border'}`}>
             <CardHeader className="p-8 text-center">
                <CardTitle className="text-2xl font-black">Security QR Token</CardTitle>
                <CardDescription className={showQR ? 'text-white/70' : ''}>
                  Automatically generated upon publishing
                </CardDescription>
             </CardHeader>
             <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                {showQR ? (
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-8"
                  >
                    <div className="p-6 bg-white rounded-[3rem] shadow-2xl">
                      <QRCodeSVG 
                        id="event-qr"
                        value={JSON.stringify({ title, secret })} 
                        size={250}
                        fgColor="#2f8d46"
                        level="H"
                        includeMargin
                      />
                    </div>
                    
                    <div className="text-center space-y-4">
                       <p className="text-sm font-bold opacity-80 max-w-[280px]">
                         Students scan this to mark attendance. Keep it displayed on the session screen.
                       </p>
                       <div className="flex flex-col sm:flex-row gap-3">
                         <Button 
                           variant="secondary"
                           onClick={downloadQR}
                           className="flex-1 rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-xl"
                         >
                           <Download size={18} />
                           Download
                         </Button>
                         <Link href={`/admin/live-wall/${title.replace(/\s+/g, '-').toLowerCase()}`} className="flex-1">
                           <Button 
                             className="w-full rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-xl bg-white text-primary border-none hover:bg-slate-50"
                           >
                             <Play size={18} fill="currentColor" />
                             Live Wall
                           </Button>
                         </Link>
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <QrCode size={80} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Enter event details to generate</p>
                  </div>
                )}
             </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
