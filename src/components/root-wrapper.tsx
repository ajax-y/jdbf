"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

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
    return <div className="min-h-screen w-full bg-[#fafafa]">{children}</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full relative bg-[#fafafa]">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-[72px] px-4 md:px-8 pb-10">
            {/* Global Header with Hamburger */}
            <div className="fixed top-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 flex items-center justify-between z-40">
               <div className="flex items-center gap-4">
                  <SidebarTrigger className="h-11 w-11 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary/20 transition-all active:scale-90">
                     <Menu size={22} strokeWidth={2.5} />
                  </SidebarTrigger>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                      G
                    </div>
                    <div>
                      <h1 className="font-bold text-sm tracking-tight text-slate-900 leading-none">GfG Club</h1>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
                        RIT Campus
                      </p>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
                   <DropdownMenuTrigger render={
                     <Button variant="ghost" size="icon-sm" className="h-11 w-11 rounded-2xl bg-white border-2 border-slate-100 shadow-sm text-slate-400 hover:text-primary transition-all relative outline-none focus:ring-0">
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full ring-2 ring-white" />}
                     </Button>
                   } />
                   <DropdownMenuContent className="w-80 p-0 rounded-[2rem] border-slate-100 shadow-2xl mr-4 overflow-hidden" align="end">
                      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-900 p-0">Notifications</DropdownMenuLabel>
                        {unreadCount > 0 && <Badge className="bg-primary text-white h-5 px-1.5 min-w-5 flex items-center justify-center text-[9px] rounded-full border-none">{unreadCount}</Badge>}
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                        {notifications.length === 0 ? (
                           <div className="p-10 text-center text-slate-400 font-bold text-sm">No notifications yet</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`p-4 rounded-xl mb-1 transition-colors ${n.read ? 'hover:bg-slate-50/50' : 'bg-primary/5 border border-primary/10'}`}>
                               <p className="text-xs font-bold text-slate-900 leading-relaxed">{n.text}</p>
                               <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-2">{n.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <DropdownMenuSeparator className="m-0" />
                      <div className="p-4 bg-slate-50/30 text-center">
                         <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all p-0 h-auto">Clear All History</Button>
                      </div>
                   </DropdownMenuContent>
                 </DropdownMenu>


                 <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-100">
                    <div className="text-right">
                       <p className="text-xs font-black text-slate-900 leading-none">
                         {isAdmin ? 'Admin Node' : 'Geek Member'}
                       </p>
                       <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-1">
                         {isAdmin ? 'System Admin' : 'Gold Tier'}
                       </p>
                    </div>
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                        {isAdmin ? 'AD' : 'GM'}
                      </AvatarFallback>
                    </Avatar>
                 </div>
               </div>
            </div>

            <div className="mt-8">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
