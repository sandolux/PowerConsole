"use client";

import Link from "next/link";
import {
  Home,
  Settings,
  PieChart,
  Database,
  FileCode,
  Terminal,
  Clock,
  Layers,
} from "lucide-react";

type SidebarContext = "dashboard" | "workspace";

interface SidebarProps {
  context?: SidebarContext;
  workspaceId?: string;
  currentSection?: string;
  onNavigate?: (section: string) => void;
}

const baseLink =
  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors";
const inactive =
  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
const active =
  "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300";

export const Sidebar = ({
  context = "dashboard",
  workspaceId,
  currentSection,
  onNavigate,
}: SidebarProps) => {
  const isWorkspace = context === "workspace" && workspaceId;

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          PowerConsole
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {!isWorkspace && (
          <>
            <Link
              href="/"
              className={`${baseLink} ${inactive}`}
            >
              <Home size={16} />
              Mis Workspaces
            </Link>
            <Link
              href="/settings"
              className={`${baseLink} ${inactive}`}
            >
              <Settings size={16} />
              Configuración Global
            </Link>
          </>
        )}

        {isWorkspace && (
          <>
            <Link
              href="/"
              className={`${baseLink} ${inactive}`}
            >
              <Home size={16} />
              Dashboard
            </Link>
            <div className="px-3 pt-4 pb-1 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Proyecto Actual
            </div>
            <button
              onClick={() => onNavigate?.("summary")}
              className={`${baseLink} ${
                currentSection === "summary" ? active : inactive
              }`}
            >
              <PieChart size={16} />
              Resumen / Stats
            </button>
            <button
              onClick={() => onNavigate?.("profiles")}
              className={`${baseLink} ${
                currentSection === "profiles" ? active : inactive
              }`}
            >
              <Database size={16} />
              Perfiles de Conexión
            </button>
            <button
              onClick={() => onNavigate?.("variables")}
              className={`${baseLink} ${
                currentSection === "variables" ? active : inactive
              }`}
            >
              <Layers size={16} />
              Variables
            </button>
            <button
              onClick={() => onNavigate?.("templates")}
              className={`${baseLink} ${
                currentSection === "templates" ? active : inactive
              }`}
            >
              <FileCode size={16} />
              Templates
            </button>
            <button
              onClick={() => onNavigate?.("runner")}
              className={`${baseLink} ${
                currentSection === "runner" ? active : inactive
              }`}
            >
              <Terminal size={16} />
              SQL Runner
            </button>
            <button
              onClick={() => onNavigate?.("logs")}
              className={`${baseLink} ${
                currentSection === "logs" ? active : inactive
              }`}
            >
              <Clock size={16} />
              Historial / Logs
            </button>
            <button
              onClick={() => onNavigate?.("settings")}
              className={`${baseLink} ${
                currentSection === "settings" ? active : inactive
              }`}
            >
              <Settings size={16} />
              Configuración
            </button>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        v0.1.0
      </div>
    </aside>
  );
};
