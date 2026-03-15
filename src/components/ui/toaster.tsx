"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Bell } from "lucide-react";

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastManager: (message: string, type: ToastType) => void;

export const toast = (message: string, type: ToastType = 'success') => {
  if (toastManager) {
    toastManager(message, type);
  } else {
    console.warn("Toast manager not initialized");
  }
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastManager = (message, type) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[99999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-4 px-8 py-5 min-w-[320px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border backdrop-blur-xl ${
              t.type === 'success' 
                ? 'bg-primary text-white border-primary/20' 
                : t.type === 'error'
                ? 'bg-rose-500 text-white border-rose-400/20'
                : 'bg-slate-900 text-white border-white/10'
            }`}
          >
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
              t.type === 'success' ? 'bg-white/20' : t.type === 'error' ? 'bg-white/20' : 'bg-white/10'
            }`}>
              {t.type === 'success' && <CheckCircle2 size={24} />}
              {t.type === 'error' && <AlertCircle size={24} />}
              {t.type === 'info' && <Bell size={24} />}
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="font-black text-[13px] tracking-tight leading-snug">{t.message}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
