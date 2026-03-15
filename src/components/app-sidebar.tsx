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
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const userItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Live Events", icon: Calendar, url: "/events" },
  { title: "Project Gallery", icon: Image, url: "/projects" },
  { title: "Leaderboard", icon: Trophy, url: "/leaderboard" },
  { title: "My Profile", icon: User, url: "/profile" },
];

const adminItems = [
  { title: "Dashboard", icon: ShieldCheck, url: "/admin" },
  { title: "Create Event", icon: PlusCircle, url: "/admin/create-event" },
  { title: "Live Wall", icon: QrCode, url: "/admin/live-wall" },
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
    <Sidebar className="border-r border-slate-200 bg-white text-slate-900">
      <SidebarHeader className="p-4">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-4 group px-2 mt-4">
          <div className="h-10 w-10 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-all duration-500 border border-slate-100 bg-white p-2">
            <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GfG Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">Club Hub</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1.5 underline decoration-primary/30 underline-offset-4">
              RIT Campus Node
            </p>
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
            <SidebarMenu className="gap-2">
              {(isAdmin ? adminItems : userItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    className="h-14 px-5 rounded-[1.2rem] data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20 hover:bg-slate-50 transition-all duration-300 group/item text-slate-700 hover:scale-[1.02]"
                  >
                    <item.icon className={`h-5 w-5 transition-transform duration-300 ${pathname === item.url ? "scale-110" : "group-hover/item:scale-110"}`} />
                    <span className="font-extrabold tracking-tight text-xs uppercase tracking-widest leading-none">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
