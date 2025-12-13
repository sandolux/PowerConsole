import { WorkspaceStats } from "@/core/domain/entities/WorkspaceStats";
import { IExecutionLogRepository } from "@/core/repositories/IExecutionLogRepository";
import { IProfileRepository } from "@/core/repositories/IProfileRepository";
import { IScriptTemplateRepository } from "@/core/repositories/IScriptTemplateRepository";
import { IVariableRepository } from "@/core/repositories/IVariableRepository";

export class GetWorkspaceStatsUseCase {
  constructor(
    private readonly logRepository: IExecutionLogRepository,
    private readonly templateRepository: IScriptTemplateRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly variableRepository: IVariableRepository
  ) {}

  async execute(workspaceId: string): Promise<WorkspaceStats> {
    const [templates, profiles, variables, logs] = await Promise.all([
      this.templateRepository.getByWorkspaceId(workspaceId),
      this.profileRepository.getByWorkspaceId(workspaceId),
      this.variableRepository.getByWorkspaceId(workspaceId),
      this.logRepository.getByWorkspaceId(workspaceId),
    ]);

    const totalTemplates = templates.length;
    const totalProfiles = profiles.length;
    const totalVariables = variables.length;
    const totalScriptsGenerated = logs.length;

    const restrictedTemplates = templates.filter(
      (template) => (template.allowedProfileIds?.length ?? 0) > 0
    ).length;
    const profilesWithRestrictionsPercentage =
      totalTemplates === 0 ? 0 : (restrictedTemplates / totalTemplates) * 100;

    const templateNameById = new Map<string, string>();
    templates.forEach((template) => {
      templateNameById.set(template.id, template.name);
    });

    const topTemplateCounter = logs.reduce<Record<string, number>>((acc, log) => {
      const key = log.templateId;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topUsedTemplates = Object.entries(topTemplateCounter)
      .map(([templateId, count]) => ({
        name: templateNameById.get(templateId) ?? templateId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const scriptsGeneratedLast7Days = logs.reduce<Record<string, number>>((acc, log) => {
      const ts = new Date(log.timestamp);
      if (ts >= sevenDaysAgo && ts <= now) {
        const day = ts.toISOString().slice(0, 10);
        acc[day] = (acc[day] ?? 0) + 1;
      }
      return acc;
    }, {});

    const recentLogs = [...logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      totalScriptsGenerated,
      totalTemplates,
      totalProfiles,
      totalVariables,
      profilesWithRestrictionsPercentage,
      topUsedTemplates,
      recentLogs,
      scriptsGeneratedLast7Days,
    };
  }
}
