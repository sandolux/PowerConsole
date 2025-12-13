"use client";

import { useEffect } from "react";
import { ExecutionLog } from "@/core/domain/entities/ExecutionLog";
import { useLogs } from "@/presentation/hooks/useLogs";
import { useTemplates } from "@/presentation/hooks/useTemplates";
import { useProfiles } from "@/presentation/hooks/useProfiles";

interface CompactLogListProps {
  workspaceId: string;
  onRestore: (log: ExecutionLog) => void;
  onDelete: (id: string) => void;
  reloadSignal?: number;
}

export const CompactLogList = ({ workspaceId, onRestore, onDelete, reloadSignal = 0 }: CompactLogListProps) => {
  const { logs, reload } = useLogs(workspaceId);
  const { templates } = useTemplates(workspaceId);
  const { profiles } = useProfiles(workspaceId);

  // Reload when parent signals
  useEffect(() => {
    reload();
  }, [reloadSignal, reload]);

  const findTemplateName = (id: string) => templates.find(t => t.id === id)?.name ?? id;
  const findProfileName = (id: string) => profiles.find(p => p.id === id)?.name ?? id;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Historial Reciente</span>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left">Hora</th>
              <th className="px-3 py-2 text-left">Template</th>
              <th className="px-3 py-2 text-left">Perfil</th>
              <th className="px-3 py-2 text-left">Resumen</th>
              <th className="px-2 py-2 text-right w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr
                key={log.id}
                className="hover:bg-indigo-50 cursor-pointer"
                onClick={() => onRestore(log)}
              >
                <td className="px-3 py-2 whitespace-nowrap text-slate-700">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-3 py-2 text-slate-700">{findTemplateName(log.templateId)}</td>
                <td className="px-3 py-2 text-slate-700">{findProfileName(log.profileId)}</td>
                <td className="px-3 py-2 text-slate-600">{log.summary}</td>
                <td className="px-2 py-2 text-right">
                  <button
                    className="text-slate-400 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(log.id);
                    }}
                    aria-label="Eliminar log"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-sm text-slate-500" colSpan={5}>
                  No hay ejecuciones recientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
