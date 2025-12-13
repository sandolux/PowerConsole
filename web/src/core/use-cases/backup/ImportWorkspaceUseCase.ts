import { BackupService } from "../../services/BackupService";
import { WorkspaceBackup } from "../../domain/entities/BackupSchema";

export class ImportWorkspaceUseCase {
  constructor(private readonly backupService: BackupService) {}

  async executeFromText(jsonText: string): Promise<void> {
    const parsed = JSON.parse(jsonText) as WorkspaceBackup;
    await this.backupService.restoreBackup(parsed);
  }

  async execute(backup: WorkspaceBackup): Promise<void> {
    await this.backupService.restoreBackup(backup);
  }
}
