import { WorkspaceBackup } from "../domain/entities/BackupSchema";
import { IWorkspaceRepository } from "../repositories/IWorkspaceRepository";
import { IProfileRepository } from "../repositories/IProfileRepository";
import { IVariableRepository } from "../repositories/IVariableRepository";
import { IScriptTemplateRepository } from "../repositories/IScriptTemplateRepository";
import { IExecutionLogRepository } from "../repositories/IExecutionLogRepository";

export class BackupService {
  constructor(
    private readonly workspaceRepo: IWorkspaceRepository,
    private readonly profileRepo: IProfileRepository,
    private readonly variableRepo: IVariableRepository,
    private readonly templateRepo: IScriptTemplateRepository,
    private readonly logRepo: IExecutionLogRepository,
  ) {}

  async createBackup(workspaceId: string): Promise<WorkspaceBackup> {
    const workspace = await this.workspaceRepo.getById(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const [profiles, variables, templates, logs] = await Promise.all([
      this.profileRepo.getByWorkspaceId(workspaceId),
      this.variableRepo.getByWorkspaceId(workspaceId),
      this.templateRepo.getByWorkspaceId(workspaceId),
      this.logRepo.getByWorkspaceId(workspaceId),
    ]);

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      workspace,
      profiles,
      variables,
      templates,
      logs,
    };
  }

  async restoreBackup(backup: WorkspaceBackup): Promise<void> {
    if (!backup || backup.version !== 1) {
      throw new Error("Versión de backup no soportada o backup inválido.");
    }

    const { workspace, profiles, variables, templates, logs } = backup;

    // Upserts
    await this.workspaceRepo.save(workspace);

    for (const profile of profiles) {
      // Repo expone create/update; usamos update y en error create
      try {
        await this.profileRepo.update(profile);
      } catch {
        await this.profileRepo.create(profile);
      }
    }

    for (const variable of variables) {
      await this.variableRepo.save(variable);
    }

    for (const template of templates) {
      await this.templateRepo.save(template);
    }

    for (const log of logs) {
      await this.logRepo.save(log);
    }
  }
}
