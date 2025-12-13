import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"; // Importar useSearchParams
import {
  Home,
  Settings,
  PieChart,
  Database,
  FileCode,
  Terminal,
  Clock,
  Layers,
  ScanBarcode,
} from "lucide-react";

interface SidebarProps {
  // Ya no se necesitan context ni workspaceId como props directas para la lógica de visualización,
  // se obtendrán del pathname.
  // Pero se mantienen para `AppLayout` si los necesita.
}

const baseLink =
  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors";
const inactive =
  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
const active =
  "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300";

export const Sidebar = ({}: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSectionParam = searchParams.get("section");

  // Determina si estamos en una ruta de workspace
  const isInWorkspace = pathname.startsWith('/workspace/') && pathname.split('/').length > 2;
  const currentWorkspaceId = isInWorkspace ? pathname.split('/')[2] : undefined;

  // Lógica de resaltado para los ítems del sidebar
  const isActive = (itemHref: string, itemId: string) => {
    // Para rutas globales (Home, Settings)
    if (!isInWorkspace && itemHref === pathname) {
      return true;
    }
    // Para el Dashboard del workspace
    if (itemId === "dashboard" && pathname === `/workspace/${currentWorkspaceId}` && (!currentSectionParam || currentSectionParam === 'summary')) {
      return true;
    }
    // Para ítems de sección dentro del workspace
    if (
      isInWorkspace &&
      pathname === `/workspace/${currentWorkspaceId}` &&
      currentSectionParam === itemId
    ) {
      return true;
    }
    return false;
  };

  // Array de ítems de navegación global
  const globalNavItems = [
    {
      id: "home",
      name: "Mis Workspaces",
      icon: <Home size={16} />,
      href: "/",
    },
    {
      id: "settings",
      name: "Configuración Global",
      icon: <Settings size={16} />,
      href: "/settings",
    },
  ];

  // Array de ítems de navegación para el workspace
  const workspaceNavItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <Home size={16} />,
      href: `/workspace/${currentWorkspaceId}`,
    },
    {
      id: "summary",
      name: "Resumen / Stats",
      icon: <PieChart size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=summary`,
    },
    {
      id: "profiles",
      name: "Perfiles de Conexión",
      icon: <Database size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=profiles`,
    },
    {
      id: "variables",
      name: "Variables",
      icon: <Layers size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=variables`,
    },
    {
      id: "templates",
      name: "Templates",
      icon: <FileCode size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=templates`,
    },
    {
      id: "runner",
      name: "SQL Runner",
      icon: <Terminal size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=runner`,
    },
    {
      id: "logs",
      name: "Historial / Logs",
      icon: <Clock size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=logs`,
    },
    {
      id: "settings",
      name: "Configuración",
      icon: <Settings size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=settings`,
    },
    {
      id: "label-viewer",
      name: "Label Viewer",
      icon: <ScanBarcode size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=label-viewer`,
    },
  ];

  // Determinar qué ítems renderizar
  const itemsToRender = isInWorkspace ? workspaceNavItems : globalNavItems;
  const currentContextTitle = isInWorkspace ? "Proyecto Actual" : ""; // "PowerConsole" es el título de la app

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
        {currentContextTitle && (
          <div className="px-3 pt-4 pb-1 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            {currentContextTitle}
          </div>
        )}
        {itemsToRender.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${baseLink} ${isActive(item.href, item.id) ? active : inactive}`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        v0.1.0
      </div>
    </aside>
  );
};
