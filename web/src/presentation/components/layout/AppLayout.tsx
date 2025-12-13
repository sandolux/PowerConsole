"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/presentation/hooks/useAuth";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <TopBar />
      <main className="ml-64 mt-16 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
