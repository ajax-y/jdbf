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
    return <div className="min-h-screen w-full bg-slate-50">{children}</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full relative bg-[#f8fafc] text-slate-900 selection:bg-primary/20">
          <AppSidebar />
          <SidebarInset className="bg-transparent flex flex-col min-h-screen overflow-x-hidden relative">
            {/* Vector Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[150px] rounded-full animate-pulse" />
               <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
               <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
            </div>
            {/* Global Header with Hamburger - Sticky within Inset */}
            <div className="sticky top-0 h-[80px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 sm:px-10 flex items-center justify-between z-40 w-full transition-all">
               <div className="flex items-center gap-6">
                  <SidebarTrigger className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/20 transition-all active:scale-95">
                     <Menu size={24} strokeWidth={2.5} />
                  </SidebarTrigger>
                                    <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 border border-slate-100 relative group overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                       <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GfG Logo" className="w-full h-full object-contain relative z-10" />
                    </div>
                    <div className="hidden xs:block">
                       <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-none">Club Hub</h1>
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1.5">
                         RIT Campus Node
                       </p>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon-sm" className="h-12 w-12 rounded-2xl bg-slate-100 border border-transparent shadow-sm text-slate-500 hover:text-primary transition-all relative outline-none focus:ring-0">
                         <Bell size={22} />
                         {unreadCount > 0 && <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-primary rounded-full ring-2 ring-white" />}
                      </Button>
                    } />
                    <DropdownMenuContent className="w-96 p-0 rounded-[2.5rem] border-slate-200 bg-white shadow-2xl mr-4 overflow-hidden text-slate-900" align="end">
                       <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                         <DropdownMenuLabel className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 p-0">Notifications</DropdownMenuLabel>
                         {unreadCount > 0 && <Badge className="bg-primary text-white h-6 px-2.5 min-w-6 flex items-center justify-center text-[10px] rounded-full border-none font-black">{unreadCount}</Badge>}
                       </div>
                       <div className="max-h-[400px] overflow-y-auto p-3 no-scrollbar space-y-2">
                          {notifications.length === 0 ? (
                             <div className="p-16 text-center text-slate-400 font-bold text-sm">No new signals received.</div>
                          ) : (
                            notifications.map((n: any) => (
                              <div key={n.id} className={`p-5 rounded-[1.5rem] transition-all ${n.read ? 'hover:bg-slate-50' : 'bg-primary/5 border border-primary/10'}`}>
                                 <p className="text-sm font-bold text-slate-800 leading-relaxed">{n.text}</p>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-3">{n.time}</p>
                              </div>
                            ))
                          )}
                       </div>
                       <DropdownMenuSeparator className="m-0 border-slate-100" />
                       <div className="p-5 bg-slate-50/30 text-center">
                          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all p-0 h-auto">Clear All History</Button>
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
