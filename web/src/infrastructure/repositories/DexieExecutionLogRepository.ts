import { ExecutionLog } from "../../core/domain/entities/ExecutionLog";
import { IExecutionLogRepository } from "../../core/repositories/IExecutionLogRepository";
import { db } from "../persistence/db";

export class DexieExecutionLogRepository implements IExecutionLogRepository {
  async save(log: ExecutionLog): Promise<void> {
    await db.executionLogs.put(log);
  }

  async getAll(): Promise<ExecutionLog[]> {
    return db.executionLogs.toArray();
  }

  async getByWorkspaceId(workspaceId: string): Promise<ExecutionLog[]> {
    return db.executionLogs.where({ workspaceId }).reverse().sortBy('timestamp');
  }

  async delete(id: string): Promise<void> {
    await db.executionLogs.delete(id);
  }
}
