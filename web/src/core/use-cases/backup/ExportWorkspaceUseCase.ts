import { BackupService } from "../../services/BackupService";
import { WorkspaceBackup } from "../../domain/entities/BackupSchema";

export class ExportWorkspaceUseCase {
  constructor(private readonly backupService: BackupService) {}

  async execute(workspaceId: string): Promise<{ backup: WorkspaceBackup; filename: string }> {
    const backup = await this.backupService.createBackup(workspaceId);
    const date = new Date().toISOString().split('T')[0];
    const filename = `backup-powerconsole-${date}.json`;
    return { backup, filename };
  }
}
