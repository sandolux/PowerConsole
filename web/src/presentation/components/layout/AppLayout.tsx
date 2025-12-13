"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <TopBar />
     // El contenedor principal (children) debe tener estas clases para ser un "IDE" real
      <main className="ml-64 mt-16 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
