"use client";

import { useState } from "react";
import { useWorkspaceDetail } from "@/presentation/hooks/useWorkspaceDetail";
import { ProfileList } from "@/presentation/components/profiles/ProfileList";
import { VariableList } from "@/presentation/components/variables/VariableList";
import { SqlRunner } from "@/presentation/components/runner/SqlRunner";
import { TemplateList } from "@/presentation/components/templates/TemplateList";
import { BackupPanel } from "@/presentation/components/settings/BackupPanel";
import { DashboardStats } from "@/presentation/components/stats/DashboardStats";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/presentation/components/layout/AppLayout";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { workspace, loading, error } = useWorkspaceDetail(id);
  const [activeSection, setActiveSection] = useState<
    "profiles" | "variables" | "templates" | "runner" | "settings" | "summary" | "logs"
  >("summary");

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
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { id: "summary", label: "Resumen / Stats" },
              { id: "profiles", label: "Perfiles" },
              { id: "variables", label: "Variables" },
              { id: "templates", label: "Templates" },
              { id: "runner", label: "SQL Runner" },
              { id: "logs", label: "Historial / Logs" },
              { id: "settings", label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 transition ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-gray-50 dark:bg-gray-950">
            {activeSection === "profiles" && <ProfileList workspaceId={id} />}
            {activeSection === "variables" && <VariableList workspaceId={id} />}
            {activeSection === "templates" && <TemplateList workspaceId={id} />}
            {activeSection === "runner" && <SqlRunner workspaceId={id} />}
            {activeSection === "settings" && <BackupPanel workspaceId={id} />}
            {activeSection === "summary" && <DashboardStats workspaceId={id} />}
            {activeSection === "logs" && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm" id="logs">
                <p className="text-slate-500 dark:text-slate-400">Historial / Logs integrados dentro del Runner.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
