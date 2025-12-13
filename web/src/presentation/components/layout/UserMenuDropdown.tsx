"use client";

import { useState } from "react";
import { User as UserIcon, LogOut, Settings as SettingsIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import { ThemeToggle } from "@/presentation/components/ui/ThemeToggle";

export const UserMenuDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        aria-label="Abrir menú de usuario"
      >
        <UserIcon size={16} />
        <span className="text-sm">{user?.username ?? "Usuario"}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 z-20">
          <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user?.username ?? "Invitado"}
            </p>
            {user?.email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/settings/profile"
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setOpen(false)}
            >
              <SettingsIcon size={16} />
              Configuración de Perfil
            </Link>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ThemeToggle />
              <span> Tema</span>
            </div>
            <button
              className="flex w-full items-center gap-2 px-2 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
