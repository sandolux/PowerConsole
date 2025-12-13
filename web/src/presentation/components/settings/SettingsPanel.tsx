"use client";

import { VariableList } from "@/presentation/components/variables/VariableList";
import { BackupPanel } from "@/presentation/components/settings/BackupPanel";

export const SettingsPanel = ({ workspaceId }: { workspaceId: string }) => {
  return (
    <div className="space-y-6">
      <VariableList workspaceId={workspaceId} />

      <BackupPanel workspaceId={workspaceId} />
    </div>
  );
};
