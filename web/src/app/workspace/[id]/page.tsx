"use client";

import { useState } from "react";
import { useWorkspaceDetail } from "@/presentation/hooks/useWorkspaceDetail";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/Tabs";
import { ProfileList } from "@/presentation/components/profiles/ProfileList";
import { VariableList } from "@/presentation/components/variables/VariableList";
import { SqlRunner } from "@/presentation/components/runner/SqlRunner";
import { TemplateList } from "@/presentation/components/templates/TemplateList";
import { BackupPanel } from "@/presentation/components/settings/BackupPanel";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { workspace, loading, error } = useWorkspaceDetail(id);
  const [activeTab, setActiveTab] = useState("profiles");

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
    <div className="bg-slate-50 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {workspace.name}
        </h1>
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Volver
        </Link>
      </header>
      <div className="mt-6">
        <Tabs defaultValue="profiles">
          <TabsList>
            <TabsTrigger value="profiles">Perfiles de Conexión</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="sql-runner">SQL Runner</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profiles">
            <ProfileList workspaceId={id} />
          </TabsContent>
          <TabsContent value="variables">
            <VariableList workspaceId={id} />
          </TabsContent>
          <TabsContent value="templates">
            <TemplateList workspaceId={id} />
          </TabsContent>
          <TabsContent value="sql-runner">
            <SqlRunner workspaceId={id} />
          </TabsContent>
          <TabsContent value="logs">
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg">
              <p className="text-slate-500">
                Aquí irá el registro de logs y actividades.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <BackupPanel workspaceId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
