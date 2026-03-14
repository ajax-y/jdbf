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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Live Events", icon: Calendar, url: "/events" },
  { title: "Project Gallery", icon: Image, url: "/projects" },
  { title: "Leaderboard", icon: Trophy, url: "/leaderboard" },
];

const adminItems = [
  { title: "Admin Panel", icon: ShieldCheck, url: "/admin" },
  { title: "Create Event", icon: PlusCircle, url: "/admin/create-event" },
  { title: "Attendance Wall", icon: QrCode, url: "/admin/live-wall" },
];

export function AppSidebar() {
  const pathname = usePathname();
  // TODO: Implement actual auth/role check
  const isAdmin = true; 

  return (
    <Sidebar className="border-r border-border/50 bg-card">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            G
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">GfG Club</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              RIT Campus
            </p>
          </div>
        </div>
      </SidebarHeader>
      <Separator className="opacity-50" />
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 mb-2 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    className="h-11 px-3 data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-200"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 mb-2 px-3">
              Administrator
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                      className="h-11 px-3 data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-200"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-muted/50 p-3 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">John Doe</p>
              <p className="text-[10px] text-muted-foreground truncate">
                Gold Member
              </p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-background border border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300">
            <LogOut className="h-3 w-3" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
