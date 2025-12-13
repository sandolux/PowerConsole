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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Historial Reciente</span>
      </div>
      <div className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800 bg-white dark:bg-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-[11px] tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left">Hora</th>
              <th className="px-3 py-2 text-left">Template</th>
              <th className="px-3 py-2 text-left">Perfil</th>
              <th className="px-3 py-2 text-left">Resumen</th>
              <th className="px-2 py-2 text-right w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.map(log => (
              <tr
                key={log.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => onRestore(log)}
              >
                <td className="px-3 py-2 whitespace-nowrap text-gray-800 dark:text-gray-300">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-3 py-2 text-gray-800 dark:text-gray-300">{findTemplateName(log.templateId)}</td>
                <td className="px-3 py-2 text-gray-800 dark:text-gray-300">{findProfileName(log.profileId)}</td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{log.summary}</td>
                <td className="px-2 py-2 text-right">
                  <button
                    className="text-gray-400 hover:text-red-600"
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
                <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-400" colSpan={5}>
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
