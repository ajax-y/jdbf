"use client";

import {
  LayoutDashboard,
  Calendar,
  Image,
  Trophy,
  User,
  ShieldCheck,
  LogOut,
  PlusCircle,
  QrCode,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const userItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Live Events", icon: Calendar, url: "/events" },
  { title: "Project Gallery", icon: Image, url: "/projects" },
  { title: "Leaderboard", icon: Trophy, url: "/leaderboard" },
  { title: "My Profile", icon: User, url: "/profile" },
];

const adminItems = [
  { title: "Command Center", icon: ShieldCheck, url: "/admin" },
  { title: "Create Event", icon: PlusCircle, url: "/admin/create-event" },
  { title: "Live Wall", icon: QrCode, url: "/admin/live-wall" },
  { title: "App Analytics", icon: BarChart3, url: "/admin/analytics" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionUser, setSessionUser] = useState<{name: string, role: string}>({ name: 'Guest', role: 'Member' });

  useEffect(() => {
    const session = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
    if (session === "admin") {
      setIsAdmin(true);
      setSessionUser({ name: 'Admin Node', role: 'System Admin' });
    } else if (session === "user") {
      setIsAdmin(false);
      setSessionUser({ name: 'Geek Member', role: 'Gold Tier' });
    }
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "gfg_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <Sidebar className="border-r border-border/50 bg-card">
      <SidebarHeader className="p-6">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
            G
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-slate-900">GfG Club</h1>
            <div className="flex items-center gap-2">
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                 RIT Campus
               </p>
               {isAdmin && (
                 <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Admin</span>
               )}
            </div>
          </div>
        </Link>
      </SidebarHeader>
      
      <Separator className="opacity-50 mx-4 w-auto" />
      
      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-4 px-3">
             {isAdmin ? 'System Management' : 'Member Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(isAdmin ? adminItems : userItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    className="h-12 px-4 rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-sm transition-all duration-300 group/item"
                  >
                    <item.icon className={`h-5 w-5 transition-transform duration-300 ${pathname === item.url ? "scale-110" : "group-hover/item:scale-110"}`} />
                    <span className="font-bold tracking-tight">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-[2.5rem] bg-slate-50 p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10 p-0.5">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                {isAdmin ? 'AD' : 'GM'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate tracking-tight">{sessionUser.name}</p>
              <p className="text-[9px] text-primary uppercase font-black tracking-widest mt-0.5">
                {sessionUser.role}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] gap-3 bg-white border border-slate-100 hover:bg-destructive hover:text-white hover:border-destructive transition-all w-full shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            End Session Hub
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
