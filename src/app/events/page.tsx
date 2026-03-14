"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle2, History, Info, XCircle, QrCode, ArrowRight, Zap, Sparkles, Loader2, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function JoinEventPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [history] = useState([]);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.error("Stop failed", err);
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const startScanner = async () => {
    setResult(null);
    setErrorHeader(null);
    setScanning(true);
  };

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const config = { fps: 15, qrbox: { width: 280, height: 280 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          const processAttendance = async () => {
             try {
               const data = JSON.parse(decodedText);
               const userId = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
               
               if (data.id && userId) {
                 await stopScanner();
                 
                 // 1. Insert Attendance
                 const { error: attendError } = await supabase
                   .from('attendance')
                   .insert([{ event_id: data.id, user_id: userId }]);

                 if (attendError) throw attendError;

                 // 2. Fetch User Name for Message
                 const { data: profile } = await supabase
                   .from('profiles')
                   .select('full_name')
                   .eq('id', userId)
                   .single();

                 setResult({ 
                   status: 'success', 
                   message: `Successfully joined "${data.title || 'the event'}" as ${profile?.full_name || 'Member'}. 10 merit points added.` 
                 });
               }
             } catch (e) {
               // Silently fail if not our QR
             }
          };
          processAttendance();
        },
        (errorMessage) => {
          // ignore scan errors
        }
      ).catch(err => {
        console.error("Camera Start Error:", err);
        setErrorHeader("Camera Access Denied");
        setResult({ 
          status: 'error', 
          message: "Check permissions or ensure you are on HTTPS. Some browsers block camera on insecure connections." 
        });
        setScanning(false);
        scannerRef.current = null;
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [scanning]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-[#1a1c2c]/60 backdrop-blur-2xl p-12 sm:p-20 rounded-[4rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white/5">
        <div className="relative z-10 flex-1 overflow-hidden">
          <Badge className="bg-primary/20 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8 sm:mb-10">Attendance Link</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-none">
            Live <span className="text-primary italic">Events.</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-slate-400 max-w-xl leading-relaxed uppercase tracking-widest">
            Scan the verified session token to establish your participation node and synchronize merit points.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
           {!scanning ? (
             <Button 
               onClick={startScanner}
               className="w-full sm:w-auto h-24 rounded-[3rem] px-16 font-black text-xs uppercase tracking-[0.2em] gap-5 shadow-2xl shadow-primary/20 bg-primary text-white hover:scale-[1.05] active:scale-95 transition-all outline-none border-none ring-offset-[#0a0b14] focus-visible:ring-primary"
             >
                <Camera size={28} strokeWidth={2.5} />
                Open Scanners
             </Button>
           ) : (
             <Button 
               variant="ghost"
               onClick={stopScanner}
               className="w-full sm:w-auto h-20 rounded-[2.5rem] px-12 font-black text-xs uppercase tracking-[0.2em] gap-3 bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all shadow-xl"
             >
                <XCircle size={24} />
                Close Relay
             </Button>
           )}
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none translate-x-1/4 translate-y-[-10%]">
           <Zap size={600} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-10">
          <Card className={`border-none shadow-2xl overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] transition-all duration-700 bg-[#1a1c2c]/60 backdrop-blur-xl text-white ${scanning ? 'ring-8 ring-primary/10 border-primary/20' : 'border border-white/5'}`}>
             <CardHeader className="bg-white/5 p-8 sm:p-10 border-b border-white/5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                   <div className="flex items-center gap-6">
                      <div className={`h-4 w-4 rounded-full ${scanning ? 'bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-slate-700'}`} />
                      <div className="overflow-hidden">
                        <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none truncate">{scanning ? 'Establishing Handshake...' : 'System Available'}</CardTitle>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3">Optical Recognition Active</p>
                      </div>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="relative min-h-[400px] sm:min-h-[550px] flex items-center justify-center bg-slate-50/30">
                   <div 
                      id="qr-reader" 
                      className={`w-full h-full max-w-[450px] mx-auto overflow-hidden rounded-[3rem] shadow-inner ${scanning ? 'block' : 'hidden'}`} 
                   />

                   {!scanning && !result && (
                      <div className="text-center p-12 space-y-8">
                         <div className="relative">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-[-30px] border-2 border-dashed border-white/10 rounded-[4rem]"
                            />
                            <div className="h-48 w-48 rounded-[4rem] bg-white/5 shadow-2xl flex items-center justify-center mx-auto ring-1 ring-white/10 relative z-10">
                               <QrCode size={80} className="text-white/10" />
                            </div>
                         </div>
                         <div className="space-y-4">
                           <h3 className="text-3xl font-black text-white tracking-tight leading-none">Signal Lost</h3>
                           <p className="text-slate-200 font-bold max-w-xs mx-auto text-base">Activate the optical scanner to detect the club session security token.</p>
                         </div>
                      </div>
                   )}

                   <AnimatePresence>
                      {result && !scanning && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute inset-6 sm:inset-12 flex items-center justify-center z-50 pointer-events-none"
                        >
                           <Card className={`pointer-events-auto border-none shadow-[0_50px_120px_rgba(0,0,0,0.25)] rounded-[4.5rem] overflow-hidden w-full max-w-md ${
                             result.status === 'success' ? 'bg-slate-900 text-white' : 'bg-destructive text-white'
                           }`}>
                              <CardContent className="p-16 text-center flex flex-col items-center gap-10">
                                 <motion.div
                                   initial={{ scale: 0, rotate: -45 }}
                                   animate={{ scale: 1, rotate: 0 }}
                                   className={`h-28 w-28 rounded-full flex items-center justify-center shadow-2xl ${result.status === 'success' ? 'bg-primary text-white shadow-primary/20' : 'bg-white/20'}`}
                                 >
                                    {result.status === 'success' ? (
                                      <CheckCircle2 size={60} strokeWidth={2.5} />
                                    ) : (
                                      <XCircle size={60} strokeWidth={2.5} />
                                    )}
                                 </motion.div>
                                 <div className="space-y-4">
                                    <h2 className="text-4xl font-black tracking-tighter">{result.status === 'success' ? 'Synchronized' : (errorHeader || 'System Error')}</h2>
                                    <p className="text-lg font-bold opacity-80 leading-relaxed">{result.message}</p>
                                 </div>
                                 <Button 
                                   variant="secondary"
                                   onClick={() => setResult(null)}
                                   className="w-full rounded-[2rem] h-16 font-black text-xs uppercase tracking-widest mt-6 bg-white text-slate-900 border-none shadow-2xl hover:bg-slate-100 transition-all active:scale-95"
                                 >
                                    <RefreshCcw size={18} className="mr-2" />
                                    Reset Protocol
                                 </Button>
                              </CardContent>
                           </Card>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </CardContent>
          </Card>
          
          <div className="flex gap-8 p-10 rounded-[3.5rem] bg-primary/5 border border-primary/10 relative group overflow-hidden">
             <div className="h-16 w-16 rounded-[1.5rem] bg-[#0a0b14] shadow-xl flex items-center justify-center shrink-0 border border-white/5 relative z-10 ring-1 ring-primary/20">
                <Info className="text-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]" size={32} />
             </div>
             <div className="relative z-10 overflow-hidden">
                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-primary block mb-3">Protocol Briefing</span>
                <p className="text-base font-bold text-slate-400 leading-relaxed uppercase tracking-widest text-[11px]">
                  Encryption keys are unique to each session node. Ensure you are using HTTPS to allow camera operations. Optical detection works best in balanced lighting. 
                </p>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                <Sparkles size={120} className="text-primary" />
             </div>
          </div>
        </div>

        <div className="space-y-10">
           <Card className="border-none shadow-2xl bg-[#1a1c2c]/60 backdrop-blur-xl overflow-hidden border border-white/5 rounded-[3.5rem] relative">
              <CardHeader className="p-10 pb-6">
                 <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                       <History className="text-slate-500" size={28} />
                    </div>
                    <div className="overflow-hidden">
                      <CardTitle className="text-2xl font-black text-white tracking-tight leading-none truncate">Archives</CardTitle>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-3">Previous Check-ins</p>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="px-10 pb-12">
                 {history.length === 0 ? (
                   <div className="py-24 text-center space-y-8 overflow-hidden">
                      <div className="relative inline-block">
                        <div className="h-32 w-32 rounded-[3.5rem] bg-white/5 flex items-center justify-center mx-auto border border-white/5 shadow-2xl ring-1 ring-white/5">
                           <History className="text-slate-800" size={48} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Empty Databank</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">No historical tokens found on this node</p>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6">
                   </div>
                 )}
                 <Button disabled variant="ghost" className="w-full rounded-2xl h-16 font-black text-[10px] uppercase tracking-[0.3em] opacity-40 border border-white/5 mt-6 group text-slate-600">
                    <History size={16} className="group-hover:rotate-[-45deg] transition-transform mr-3" />
                    Archives Locked
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
