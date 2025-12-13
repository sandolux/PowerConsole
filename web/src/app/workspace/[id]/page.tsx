"use client";

import { useState } from "react";
import { useWorkspaceDetail } from "@/presentation/hooks/useWorkspaceDetail";
import { ProfileList } from "@/presentation/components/profiles/ProfileList";
import { SqlRunner } from "@/presentation/components/runner/SqlRunner";
import { TemplateList } from "@/presentation/components/templates/TemplateList";
import { DashboardStats } from "@/presentation/components/stats/DashboardStats";
import { SettingsPanel } from "@/presentation/components/settings/SettingsPanel";
import { LabelViewer } from "@/presentation/components/tools/LabelViewer"; // Importar LabelViewer
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation"; // Importar useSearchParams
import { AppLayout } from "@/presentation/components/layout/AppLayout";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { workspace, loading, error } = useWorkspaceDetail(id);
  
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "summary"; // Obtener 'section' de la URL, por defecto 'summary'

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <p className="text-slate-500">Cargando workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <p className="text-slate-500">Workspace no encontrado</p>
      </div>
    );
  }

  // Función para renderizar el componente activo
  const renderActiveSection = () => {
    switch (activeSection) {
      case "profiles":
        return <ProfileList workspaceId={id} />;
      case "templates":
        return <TemplateList workspaceId={id} />;
      case "runner":
        return <SqlRunner workspaceId={id} />;
      case "settings":
        return <SettingsPanel workspaceId={id} />;
      case "summary":
        return <DashboardStats workspaceId={id} />;
      case "logs":
        return (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm" id="logs">
            <p className="text-slate-500 dark:text-slate-400">Historial / Logs integrados dentro del Runner.</p>
          </div>
        );
      case "label-viewer":
        return <LabelViewer workspaceId={id} />;
      default:
        return <DashboardStats workspaceId={id} />;
    }
  };

  return (
    <AppLayout>
      <div className="bg-gray-50 dark:bg-gray-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {workspace.name}
            </h1>
          </div>
        </header>

        <div className="mt-6 space-y-4">
          <div className="mt-4 bg-gray-50 dark:bg-gray-950">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
