import { ExecutionLog } from '../domain/entities/ExecutionLog';

export interface IExecutionLogRepository {
  save(log: ExecutionLog): Promise<void>;
  getAll(): Promise<ExecutionLog[]>;
  getByWorkspaceId(workspaceId: string): Promise<ExecutionLog[]>;
  delete(id: string): Promise<void>;
}
