export interface ExecutionLog {
  id: string;
  timestamp: Date;
  runnerType: string;
  status: 'SUCCESS' | 'ERROR';
  durationMs: number;
  summary: string;
}
