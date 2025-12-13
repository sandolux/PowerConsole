"use client";

import { Search } from "lucide-react";
import { UserMenuDropdown } from "./UserMenuDropdown";

export const TopBar = () => {
  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 fixed top-0 right-0 left-64 flex items-center justify-between px-6 z-10">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Dashboard
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <UserMenuDropdown />
      </div>
    </header>
  );
};
