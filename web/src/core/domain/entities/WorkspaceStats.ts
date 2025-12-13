import { ExecutionLog } from "./ExecutionLog";

export interface WorkspaceStats {
  totalScriptsGenerated: number;
  totalTemplates: number;
  totalProfiles: number;
  totalVariables: number;
  profilesWithRestrictionsPercentage: number;
  topUsedTemplates: Array<{ name: string; count: number }>;
  recentLogs: ExecutionLog[];
  scriptsGeneratedLast7Days: Record<string, number>;
}
