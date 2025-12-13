"use client";

import { useCallback } from "react";
import { useDi } from "../context/DiContext";
import { ExportWorkspaceUseCase } from "@/core/use-cases/backup/ExportWorkspaceUseCase";
import { ImportWorkspaceUseCase } from "@/core/use-cases/backup/ImportWorkspaceUseCase";

export const useBackup = (workspaceId?: string) => {
  const { exportWorkspaceUseCase, importWorkspaceUseCase } = useDi();

  const handleExport = useCallback(async () => {
    try {
      if (!workspaceId) throw new Error("workspaceId requerido para exportar");
      const { backup, filename } = await (exportWorkspaceUseCase as ExportWorkspaceUseCase).execute(workspaceId);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", filename);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      console.error("Error al exportar backup:", err);
    }
  }, [exportWorkspaceUseCase, workspaceId]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // detect workspace id from backup
      const workspaceIdFromBackup = parsed?.workspace?.id;
      if (!workspaceIdFromBackup) {
        throw new Error("Backup inválido: workspace.id no encontrado");
      }
      await (importWorkspaceUseCase as ImportWorkspaceUseCase).execute(parsed);
      return workspaceIdFromBackup;
    } catch (err) {
      console.error("Error al importar backup:", err);
      throw err;
    }
  }, [importWorkspaceUseCase]);

  return { handleExport, handleImport };
};
