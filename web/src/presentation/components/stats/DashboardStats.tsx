"use client";

import { useMemo } from "react";
import { useWorkspaceStats } from "@/presentation/hooks/useWorkspaceStats";
import { ArrowUp, BarChart3, Database, FileCode2, Logs, Users } from "lucide-react";
import { ExecutionLog } from "@/core/domain/entities/ExecutionLog";

interface DashboardStatsProps {
  workspaceId: string;
  onRestoreLog?: (log: ExecutionLog) => void;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 shadow-sm">
    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

export const DashboardStats = ({ workspaceId, onRestoreLog }: DashboardStatsProps) => {
  const { stats, loading, error, reload } = useWorkspaceStats(workspaceId);

  const last7Days = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.scriptsGeneratedLast7Days)
      .sort(([a], [b]) => (a < b ? 1 : -1)) // most recent first
      .slice(0, 7);
  }, [stats]);

  const topTemplates = stats?.topUsedTemplates ?? [];
  const recentLogs = stats?.recentLogs ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Resumen del Proyecto</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Actividad y salud del workspace.</p>
        </div>
        <button
          onClick={reload}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowUp size={16} />
          Actualizar
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Cargando estadísticas...</p>}

      {stats && (
        <>
          {/* Fila 1: contadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={BarChart3} label="Scripts generados" value={stats.totalScriptsGenerated} />
            <StatCard icon={FileCode2} label="Templates" value={stats.totalTemplates} />
            <StatCard icon={Users} label="Perfiles" value={stats.totalProfiles} />
            <StatCard icon={Database} label="Variables" value={stats.totalVariables} />
          </div>

          {/* Fila 2: gráfica simple + top templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Actividad últimos 7 días</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Scripts generados</span>
              </div>
              <div className="space-y-2">
                {last7Days.length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sin datos recientes.</p>
                )}
                {last7Days.map(([day, count]) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="w-24 text-xs font-medium text-gray-600 dark:text-gray-400">{day}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-2 bg-indigo-500"
                        style={{ width: `${Math.min(count * 10, 100)}%` }}
                        aria-label={`Scripts ${count}`}
                      />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Top 5 Templates</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Uso por log</span>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {topTemplates.length === 0 && (
                  <li className="py-3 text-sm text-gray-600 dark:text-gray-400">Sin datos.</li>
                )}
                {topTemplates.map((item) => (
                  <li key={item.name} className="py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-800 dark:text-gray-200">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fila 3: logs recientes */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Logs recientes</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Últimas 5 ejecuciones</p>
              </div>
              <Logs size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Fecha</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Template</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Perfil</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Resumen</th>
                    {onRestoreLog && <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-200">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentLogs.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400" colSpan={onRestoreLog ? 5 : 4}>
                        Sin logs disponibles.
                      </td>
                    </tr>
                  )}
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-300">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-300">{log.templateId}</td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-300">{log.profileId}</td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-300">{log.summary}</td>
                      {onRestoreLog && (
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => onRestoreLog(log)}
                            className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-200 text-sm font-medium"
                          >
                            Restaurar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
