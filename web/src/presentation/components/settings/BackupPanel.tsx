"use client";

import { useRef } from "react";
import { useBackup } from "@/presentation/hooks/useBackup";
import { Download, Upload } from "lucide-react";

export const BackupPanel = ({ workspaceId }: { workspaceId: string }) => {
  const { handleExport, handleImport } = useBackup(workspaceId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await handleImport(file);
      // TODO: replace with toast
      alert("Backup importado correctamente.");
    } catch (err) {
      alert("Error al importar backup. Revisa la consola.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          Copia de Seguridad
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Descarga un archivo JSON con toda tu configuración (Perfiles, Templates, Logs).
        </p>
        <button
          onClick={handleExport}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          type="button"
        >
          <Download size={16} />
          Exportar Workspace
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          Restaurar Copia
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Restaura una configuración previa. Esto fusionará/sobrescribirá los datos actuales.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Upload size={16} />
            Seleccionar Archivo...
          </button>
        </div>
      </div>
    </div>
  );
};
