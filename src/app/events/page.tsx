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
import { Badge } from "@/components/ui/badge";

export default function JoinEventPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);

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
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">
            Live <span className="text-primary">Events.</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Scan session QR to mark presence and earn points.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className={`border-none shadow-2xl overflow-hidden transition-all duration-500 ${scanning ? 'ring-4 ring-primary/20' : ''}`}>
             <CardHeader className="bg-muted/10 p-8 border-b">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${scanning ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                      <CardTitle className="text-2xl font-black">{scanning ? 'Scanning...' : 'Ready to Scan'}</CardTitle>
                   </div>
                   {!scanning && (
                     <Button 
                       onClick={() => setScanning(true)}
                       className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2 h-12 px-6"
                     >
                        <Camera size={18} />
                        Open Scanner
                     </Button>
                   )}
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="relative min-h-[400px] flex items-center justify-center bg-black/5">
                   {scanning ? (
                      <div id="qr-reader" className="w-full" />
                   ) : (
                      <div className="text-center p-12 space-y-6">
                         <div className="h-40 w-40 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center mx-auto opacity-40">
                            <QrCode size={80} className="text-primary" />
                         </div>
                         <div className="space-y-2">
                           <h3 className="text-xl font-black">Camera Disconnected</h3>
                           <p className="text-muted-foreground font-medium">Click the button above to begin verification</p>
                         </div>
                      </div>
                   )}

                   <AnimatePresence>
                      {result && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute inset-4 flex items-center justify-center pointer-events-none"
                        >
                           <Card className={`pointer-events-auto border-none shadow-2xl rounded-[2.5rem] overflow-hidden ${
                             result.status === 'success' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
                           }`}>
                              <CardContent className="p-10 text-center flex flex-col items-center gap-6">
                                 {result.status === 'success' ? (
                                   <CheckCircle2 size={100} className="text-white" />
                                 ) : (
                                   <XCircle size={100} className="text-white" />
                                 )}
                                 <div className="space-y-2">
                                    <h2 className="text-3xl font-black tracking-tight">{result.status === 'success' ? 'Verified!' : 'Failed!'}</h2>
                                    <p className="text-lg font-medium opacity-90">{result.message}</p>
                                 </div>
                                 <Button 
                                   variant="secondary"
                                   onClick={() => setResult(null)}
                                   className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest mt-4"
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
          
          <div className="flex gap-4 p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
             <Info className="text-primary shrink-0" />
             <p className="text-sm font-medium leading-relaxed">
               <span className="font-black uppercase tracking-widest text-[10px] block mb-1">How it works</span>
               Ensure you are logged in correctly. Each QR scan is unique and tied to your profile. Manual attendance requests can be made to admins if technical issues persist.
             </p>
          </div>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-xl bg-card overflow-hidden">
              <CardHeader className="p-8">
                 <div className="flex items-center gap-3">
                   <History className="text-primary" />
                   <CardTitle className="text-xl font-black">Recent History</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-muted/30 group hover:bg-primary/5 transition-colors cursor-default">
                       <div>
                          <p className="font-bold text-sm">GfG Meeting #{i}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">March {10-i}, 2024</p>
                       </div>
                       <Badge variant="outline" className="rounded-lg bg-background border-none group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-bold text-[10px]">
                          +50 PTS
                       </Badge>
                    </div>
                 ))}
                 <Button variant="ghost" className="w-full rounded-xl font-bold text-xs uppercase tracking-widest opacity-50">
                    View Full History
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
