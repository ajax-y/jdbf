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
          try {
            const data = JSON.parse(decodedText);
            if (data.secret) {
              stopScanner();
              setResult({ status: 'success', message: `Identity verified for ${data.title}. Merit points added to profile.` });
            }
          } catch (e) {
            // Keep scanning, maybe not our JSON
          }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-900 p-12 sm:p-20 rounded-[4rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">Attendance Link</Badge>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-none">
            Live <span className="text-primary italic">Events.</span>
          </h1>
          <p className="text-xl font-bold text-slate-400 max-w-xl leading-relaxed">
            Scan the verified session token to establish your participation node and synchronize merit points.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
           {!scanning ? (
             <Button 
               onClick={startScanner}
               className="w-full sm:w-auto h-20 rounded-[2.5rem] px-12 font-black text-sm uppercase tracking-widest gap-4 shadow-2xl shadow-primary/30 bg-primary text-white hover:scale-105 active:scale-95 transition-all outline-none border-none"
             >
                <Camera size={24} strokeWidth={2.5} />
                Open Scanners
             </Button>
           ) : (
             <Button 
               variant="secondary"
               onClick={stopScanner}
               className="w-full sm:w-auto h-16 rounded-[2rem] px-8 font-black text-xs uppercase tracking-widest gap-2 bg-white text-slate-900 border-none shadow-xl"
             >
                <XCircle size={20} />
                Close Relay
             </Button>
           )}
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none translate-x-1/4 translate-y-[-1/4]">
           <Zap size={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-10">
          <Card className={`border-none shadow-2xl overflow-hidden rounded-[3.5rem] transition-all duration-700 bg-white ${scanning ? 'ring-8 ring-primary/10' : 'border border-slate-50'}`}>
             <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                   <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${scanning ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                      <div>
                        <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">{scanning ? 'Establishing Handshake...' : 'System Available'}</CardTitle>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Optical Recognition Active</p>
                      </div>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="relative min-h-[550px] flex items-center justify-center bg-slate-50/30">
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
                              className="absolute inset-[-30px] border-2 border-dashed border-slate-200 rounded-[4rem]"
                            />
                            <div className="h-48 w-48 rounded-[4rem] bg-white shadow-2xl flex items-center justify-center mx-auto ring-1 ring-slate-100 relative z-10">
                               <QrCode size={80} className="text-slate-100" />
                            </div>
                         </div>
                         <div className="space-y-4">
                           <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-none">Signal Lost</h3>
                           <p className="text-slate-400 font-bold max-w-xs mx-auto text-base">Activate the optical scanner to detect the club session security token.</p>
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
          
          <div className="flex gap-8 p-10 rounded-[3.5rem] bg-amber-50/50 border border-amber-100 relative group overflow-hidden">
             <div className="h-16 w-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center shrink-0 border border-amber-100 relative z-10">
                <Info className="text-amber-500" size={32} />
             </div>
             <div className="relative z-10">
                <span className="font-black uppercase tracking-[0.2em] text-[10px] text-amber-600 block mb-2">Protocol Briefing</span>
                <p className="text-base font-bold text-amber-900/60 leading-relaxed">
                  Encryption keys are unique to each session node. Ensure you are using HTTPS to allow camera operations. Optical detection works best in balanced lighting. 
                </p>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Sparkles size={100} className="text-amber-900" />
             </div>
          </div>
        </div>

        <div className="space-y-10">
           <Card className="border-none shadow-2xl bg-white overflow-hidden border border-slate-50 rounded-[3.5rem]">
              <CardHeader className="p-10 pb-4">
                 <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                       <History className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">Archives</CardTitle>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Previous Check-ins</p>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="px-10 pb-12">
                 {history.length === 0 ? (
                   <div className="py-20 text-center space-y-6">
                      <div className="relative inline-block">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                           <History className="text-slate-200" size={40} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Empty Databank</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">No historical tokens found on this node</p>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6">
                   </div>
                 )}
                 <Button disabled variant="outline" className="w-full rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest opacity-50 border-2 border-slate-50 mt-4 group">
                    <History size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    Archives Locked
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
