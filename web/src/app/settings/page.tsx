"use client";

import { AppLayout } from "@/presentation/components/layout/AppLayout";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Configuración Global
        </h1>
        <p className="text-gray-800 dark:text-gray-200">
          Funcionalidad de gestión de usuarios y ajustes de aplicación. Próximamente.
        </p>
      </div>
    </AppLayout>
  );
}
