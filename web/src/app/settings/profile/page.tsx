"use client";

import { AppLayout } from "@/presentation/components/layout/AppLayout";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Configuración de Perfil</h1>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
              <input
                type="text"
                value={user?.username ?? ""}
                readOnly
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 transition-colors"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Placeholder: pronto podrás editar tu perfil y cambiar contraseña.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
