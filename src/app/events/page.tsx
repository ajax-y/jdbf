"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, History, Info, XCircle } from "lucide-react";

export default function JoinEventPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [history] = useState([]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scanner.render((decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.secret) {
            setResult({ status: 'success', message: `Signed into ${data.title}!` });
            setScanning(false);
            scanner.clear();
          }
        } catch (e) {
          setResult({ status: 'error', message: "Invalid QR code" });
        }
      }, (error) => {
        // console.warn(error);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanning]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Live <span className="text-primary italic">Events.</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-bold">
            Scan session QR to verify attendance and earn points.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className={`border-none shadow-2xl overflow-hidden transition-all duration-500 ${scanning ? 'ring-4 ring-primary/20' : 'border border-slate-100'}`}>
             <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${scanning ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                      <CardTitle className="text-2xl font-black text-slate-900">{scanning ? 'Scanning Network...' : 'Scanner Ready'}</CardTitle>
                   </div>
                   {!scanning && (
                     <Button 
                       onClick={() => setScanning(true)}
                       className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 h-12 px-8 bg-primary text-white shadow-lg shadow-primary/20"
                     >
                        <Camera size={18} />
                        Enable Camera
                     </Button>
                   )}
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="relative min-h-[450px] flex items-center justify-center bg-slate-50/30">
                   {scanning ? (
                      <div id="qr-reader" className="w-full" />
                   ) : (
                      <div className="text-center p-12 space-y-6">
                         <div className="h-48 w-48 rounded-[3rem] bg-white shadow-xl flex items-center justify-center mx-auto border border-slate-100">
                            <QrCode size={80} className="text-slate-100" />
                         </div>
                         <div className="space-y-2">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Idle</h3>
                           <p className="text-slate-400 font-bold max-w-xs mx-auto">Open the verified scanner to detect the club session QR code.</p>
                         </div>
                      </div>
                   )}

                   <AnimatePresence>
                      {result && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute inset-4 sm:inset-10 flex items-center justify-center z-50 pointer-events-none"
                        >
                           <Card className={`pointer-events-auto border-none shadow-[0_40px_100px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-hidden w-full max-w-md ${
                             result.status === 'success' ? 'bg-primary text-white' : 'bg-destructive text-white'
                           }`}>
                              <CardContent className="p-12 text-center flex flex-col items-center gap-8">
                                 <motion.div
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center"
                                 >
                                    {result.status === 'success' ? (
                                      <CheckCircle2 size={60} />
                                    ) : (
                                      <XCircle size={60} />
                                    )}
                                 </motion.div>
                                 <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tight">{result.status === 'success' ? 'Verified' : 'Error'}</h2>
                                    <p className="text-lg font-bold opacity-80">{result.message}</p>
                                 </div>
                                 <Button 
                                   variant="secondary"
                                   onClick={() => setResult(null)}
                                   className="w-full rounded-2xl h-14 font-black text-xs uppercase tracking-widest mt-4 bg-white text-slate-900 border-none shadow-xl"
                                 >
                                    Dismiss
                                 </Button>
                              </CardContent>
                           </Card>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </CardContent>
          </Card>
          
          <div className="flex gap-5 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
             <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                <Info className="text-primary" size={20} />
             </div>
             <div>
                <span className="font-black uppercase tracking-[0.2em] text-[10px] text-primary block mb-1">Operational Briefing</span>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">
                  Verification tokens are unique to your User ID. Ensure your camera lens is clean and the QR code is centered within the frame for optimal detection.
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-xl bg-white overflow-hidden border border-slate-100">
              <CardHeader className="p-8 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                       <History className="text-slate-400" size={20} />
                    </div>
                    <CardTitle className="text-xl font-black text-slate-900">Event History</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                 {history.length === 0 ? (
                   <div className="py-12 text-center space-y-4">
                      <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto">
                         <History className="text-slate-200" size={32} />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-300">No History recorded</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {/* Populated if user joins events */}
                   </div>
                 )}
                 <Button disabled variant="outline" className="w-full rounded-xl h-12 font-black text-[10px] uppercase tracking-widest opacity-50 border-slate-100">
                    Archives Locked
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function QrCode(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16V21H16" />
      <path d="M21 9V10" />
      <path d="M10 21H9" />
      <path d="M10 3V10H3" />
      <path d="M14 14H15V15H14V14Z" />
      <path d="M17 17H18V18H17V17Z" />
      <path d="M14 17H15V18H14V17Z" />
      <path d="M17 14H18V15H17V14Z" />
    </svg>
  );
}
