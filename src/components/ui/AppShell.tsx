import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";
import { TopNav } from "./TopNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopNav />
      <div className="flex-1 w-full max-w-6xl mx-auto pb-28 md:pb-8">
        {children}
      </div>
      <BottomTabBar />
    </div>
  );
}
