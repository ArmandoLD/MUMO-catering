"use client";
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';
import { SidebarNav } from "./SidebarNav";
import { Logo } from "./Logo";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="sidebar" collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <Logo className="group-data-[collapsible=icon]:hidden" />
            {/* Icon-only logo for collapsed state */}
             <Logo className="hidden h-8 w-8 items-center justify-center group-data-[collapsible=icon]:flex" />
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent className="p-2">
              <SidebarNav />
            </SidebarContent>
          </ScrollArea>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger className="sm:hidden" />
            <Logo className="text-xl sm:hidden" />
          </header>
          <ScrollArea className="h-[calc(100vh-theme(spacing.14))] md:h-screen"> {/* Adjust height for mobile header */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </AppProvider>
  );
}
