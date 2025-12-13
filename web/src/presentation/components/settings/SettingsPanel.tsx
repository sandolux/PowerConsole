"use client";

import { VariableList } from "@/presentation/components/variables/VariableList";
import { BackupPanel } from "@/presentation/components/settings/BackupPanel";

export const SettingsPanel = ({ workspaceId }: { workspaceId: string }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Variables del Workspace
        </h3>
        <VariableList workspaceId={workspaceId} />
      </div>

      <BackupPanel workspaceId={workspaceId} />
    </div>
  );
};
