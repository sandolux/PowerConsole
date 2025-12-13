export interface ExecutionLog {
  id: string;
  workspaceId: string;
  timestamp: Date;
  runnerType: string;
  status: 'SUCCESS' | 'ERROR';
  durationMs: number;
  summary: string;
  scriptGenerated?: string;
  profileId: string;
  templateId: string;
  rawInput: string;
  contextValues: Record<string, any>;
}
