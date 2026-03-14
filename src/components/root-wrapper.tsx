"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
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
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-4 px-4 md:px-8 pb-10">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
