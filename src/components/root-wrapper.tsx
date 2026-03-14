"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full relative">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-12 md:pt-4 px-4 md:px-8 pb-10">
            <div className="absolute top-4 left-4 md:hidden z-50">
               <SidebarTrigger className="bg-white shadow-md border rounded-xl h-10 w-10" />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
