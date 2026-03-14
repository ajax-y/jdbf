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
  Layout,
  BarChart3,
  Settings,
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
  
  // Simulation of Auth State
  // In a real app, this comes from Supabase hook
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check path to simulate user switching for demo
    if (pathname.includes("/admin")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <Sidebar className="border-r border-border/50 bg-card">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
            G
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">GfG Club</h1>
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
        {/* Navigation Section */}
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

        {/* Workspace Switcher Simulation */}
        <SidebarGroup className="mt-auto">
           <SidebarGroupContent>
              <div 
                onClick={() => {
                  const target = isAdmin ? "/dashboard" : "/admin";
                  router.push(target);
                }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 cursor-pointer hover:bg-muted transition-colors border border-border/10"
              >
                 <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border border-border/10">
                    <Layout className="h-4 w-4 text-muted-foreground" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Switch To</p>
                    <p className="text-xs font-bold truncate">{isAdmin ? 'Member Dashboard' : 'Admin Console'}</p>
                 </div>
              </div>
           </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-[2rem] bg-muted/50 p-4 border border-border/10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 p-0.5">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                {isAdmin ? 'AD' : 'JD'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{isAdmin ? 'Admin User' : 'John Doe'}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                {isAdmin ? 'Full Access' : 'Gold Member'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <Button variant="ghost" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-background border border-border/50">
               <Settings className="h-3.5 w-3.5" />
             </Button>
             <Button 
               onClick={handleLogout}
               variant="ghost" 
               className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-background border border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
             >
               <LogOut className="h-3.5 w-3.5" />
             </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
