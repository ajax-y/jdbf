"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
    setIsAdmin(session === "admin");
  }, [pathname]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full relative bg-[#fafafa]">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-[72px] md:pt-4 px-4 md:px-8 pb-10">
            {/* Sticky Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 flex items-center justify-between z-40 md:hidden">
               <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-transform active:scale-95">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                      {isAdmin ? 'AD' : 'JD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                     <p className="text-xs font-black text-slate-900 leading-none">
                       {isAdmin ? 'Overseer' : 'John Doe'}
                     </p>
                     <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-1">
                       {isAdmin ? 'Admin Console' : 'Member Hub'}
                     </p>
                  </div>
               </div>
               
               <SidebarTrigger className="h-11 w-11 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary/20 transition-all active:scale-90">
                  <Menu size={22} strokeWidth={2.5} />
               </SidebarTrigger>
            </div>

            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
