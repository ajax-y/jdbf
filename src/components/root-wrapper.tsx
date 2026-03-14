"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

  const [session, setSession] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, text: string, time: string, read: boolean}[]>([]);

  useEffect(() => {
    const s = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
    setSession(s || null);
    setIsAdmin(s === "admin");

    // Load initial notifications from Cloud
    const loadNotifications = async () => {
       const { data } = await supabase
         .from('notifications')
         .select('*')
         .order('created_at', { ascending: false })
         .limit(20);
       
       if (data) {
         setNotifications(data.map((n: any) => ({
           id: n.id,
           text: n.text,
           time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
           read: n.read
         })));
       }
    };

    loadNotifications();

    // Subscribe to Realtime Notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { event: 'INSERT', table: 'notifications', schema: 'public' }, 
        (payload: RealtimePostgresInsertPayload<any>) => {
          const newN = payload.new as any;
          setNotifications(prev => [{
            id: newN.id,
            text: newN.text,
            time: 'Just now',
            read: newN.read
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname]);

  const markAllAsRead = async () => {
    // 1. Update local state
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // 2. Update Cloud
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isAuthPage || !session) {
    return <div className="min-h-screen w-full bg-[#0a0b14]">{children}</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full relative bg-[#0a0b14] text-white selection:bg-primary/30">
          <AppSidebar />
          <SidebarInset className="bg-transparent flex flex-col min-h-screen overflow-x-hidden relative">
            {/* Vector Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
               <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
               <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #22c55e 1px, transparent 0)`, backgroundSize: '64px 64px' }} />
               {/* Animated Vector Lines */}
               <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                     <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#22c55e" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
               </svg>
            </div>
            {/* Global Header with Hamburger - Sticky within Inset */}
            <div className="sticky top-0 h-[72px] bg-[#0a0b14]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 flex items-center justify-between z-40 w-full">
               <div className="flex items-center gap-4">
                  <SidebarTrigger className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all active:scale-90">
                     <Menu size={22} strokeWidth={2.5} />
                  </SidebarTrigger>
                                    <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/5 shadow-[0_0_20px_rgba(34,197,94,0.1)] flex items-center justify-center p-1 sm:p-1.5 border border-primary/20 relative group overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-colors" />
                       <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GfG Logo" className="w-full h-full object-contain relative z-10" />
                    </div>
                    <div className="hidden xs:block">
                       <h1 className="font-bold text-xs sm:text-sm tracking-tight text-white leading-none">GfG Club</h1>
                       <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
                         RIT Campus
                       </p>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon-sm" className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 shadow-sm text-slate-400 hover:text-primary transition-all relative outline-none focus:ring-0">
                         <Bell size={20} />
                         {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full ring-2 ring-[#0a0b14]" />}
                      </Button>
                    } />
                    <DropdownMenuContent className="w-80 p-0 rounded-[2rem] border-white/10 bg-[#161826] shadow-2xl mr-4 overflow-hidden text-white" align="end">
                       <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                         <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-white p-0">Notifications</DropdownMenuLabel>
                         {unreadCount > 0 && <Badge className="bg-primary text-white h-5 px-1.5 min-w-5 flex items-center justify-center text-[9px] rounded-full border-none">{unreadCount}</Badge>}
                       </div>
                       <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                         {notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-500 font-bold text-sm">No notifications yet</div>
                         ) : (
                           notifications.map((n: any) => (
                             <div key={n.id} className={`p-4 rounded-xl mb-1 transition-colors ${n.read ? 'hover:bg-white/5' : 'bg-primary/10 border border-primary/20'}`}>
                                <p className="text-xs font-bold text-slate-100 leading-relaxed">{n.text}</p>
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-2">{n.time}</p>
                             </div>
                           ))
                         )}
                       </div>
                       <DropdownMenuSeparator className="m-0 border-white/5" />
                       <div className="p-4 bg-white/5 text-center">
                          <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all p-0 h-auto">Clear All History</Button>
                       </div>
                    </DropdownMenuContent>
                 </DropdownMenu>

                 <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                         <Button variant="ghost" className="flex items-center gap-3 h-auto p-1.5 pr-2 sm:pr-3 hover:bg-white/5 rounded-2xl transition-all outline-none focus:ring-0">
                           <div className="text-right hidden sm:block">
                              <p className="text-xs font-black text-white leading-none">
                                {isAdmin ? 'Admin Node' : 'Geek Member'}
                              </p>
                              <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-1">
                                {isAdmin ? 'System Admin' : 'Gold Tier'}
                              </p>
                           </div>
                          <Avatar className="h-10 w-10 ring-2 ring-primary/10 shadow-sm">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                              {isAdmin ? 'AD' : 'GM'}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      } />
                       <DropdownMenuContent className="w-56 rounded-[1.5rem] p-2 border-white/10 bg-[#161826] shadow-2xl text-white" align="end" side="bottom" sideOffset={12}>
                        <Link href="/profile">
                          <DropdownMenuItem className="rounded-xl cursor-pointer py-3.5 px-4 hover:bg-white/5 transition-colors gap-3">
                             <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                <User size={16} />
                             </div>
                             <span className="font-bold text-sm text-slate-200">Edit Profile</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator className="my-1 opacity-5 mx-2 bg-white" />
                        <DropdownMenuItem 
                          onClick={() => {
                            document.cookie = "gfg_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            window.location.href = "/";
                          }} 
                          className="rounded-xl cursor-pointer py-3.5 px-4 text-rose-400 focus:text-rose-400 focus:bg-rose-500/10 font-black gap-3"
                        >
                           <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                              <LogOut size={16} />
                           </div>
                           <span className="text-sm">Logout Session</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
               </div>
            </div>

            <div className="flex-1 p-4 sm:p-8 lg:p-12 pb-10">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
