import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSqlRunnerModal } from "../../context/SqlRunnerModalContext";
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
import { useProfiles } from "@/presentation/hooks/useProfiles";

interface SidebarProps {}

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
  const { openSqlRunnerModal } = useSqlRunnerModal();

  const isInWorkspace = pathname.startsWith('/workspace/') && pathname.split('/').length > 2;
  const currentWorkspaceId = isInWorkspace ? pathname.split('/')[2] : undefined;
  
  const { profiles } = useProfiles(currentWorkspaceId || '');

  const isActive = (itemHref: string, itemId: string) => {
    if (!isInWorkspace && itemHref === pathname) {
      return true;
    }
    if (itemId === "dashboard" && pathname === `/workspace/${currentWorkspaceId}` && (!currentSectionParam || currentSectionParam === 'summary')) {
      return true;
    }
    if (
      isInWorkspace &&
      pathname === `/workspace/${currentWorkspaceId}` &&
      currentSectionParam === itemId
    ) {
      return true;
    }
    return false;
  };

  const handleOpenSqlRunner = () => {
    if (profiles.length > 0) {
      openSqlRunnerModal('', profiles[0].id);
    } else {
      alert('No connection profiles found for this workspace. Please create a profile first.');
    }
  };

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
      id: "generator",
      name: "SQL Generator",
      icon: <FileCode size={16} />,
      href: `/workspace/${currentWorkspaceId}?section=runner`,
    },
    {
      id: "sql-runner-modal",
      name: "SQL Runner",
      icon: <Terminal size={16} />,
      onClick: handleOpenSqlRunner,
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

  const itemsToRender = isInWorkspace ? workspaceNavItems : globalNavItems;
  const currentContextTitle = isInWorkspace ? "Proyecto Actual" : "";

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
          item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className={`${baseLink} ${isActive(item.href, item.id) ? active : inactive}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ) : (
            <button
              key={item.id}
              onClick={() => item.onClick?.()}
              className={`${baseLink} ${inactive} w-full text-left`}
            >
              {item.icon}
              {item.name}
            </button>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        v0.1.0
      </div>
    </aside>
  );
};
