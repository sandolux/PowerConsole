import { ExecutionLog } from "../../domain/entities/ExecutionLog";
import { IExecutionLogRepository } from "../../repositories/IExecutionLogRepository";

interface LogExecutionInput {
  runnerType: string;
  status: 'SUCCESS' | 'ERROR';
  durationMs: number;
  summary: string;
  scriptGenerated?: string;
  profileId: string;
  templateId: string;
  rawInput: string;
  contextValues: Record<string, any>;
  workspaceId: string;
}

export class LogExecutionUseCase {
  constructor(private readonly executionLogRepository: IExecutionLogRepository) {}

  async execute(input: LogExecutionInput): Promise<void> {
    const log: ExecutionLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      runnerType: input.runnerType,
      status: input.status,
      durationMs: input.durationMs,
      summary: input.summary,
      scriptGenerated: input.scriptGenerated,
      profileId: input.profileId,
      templateId: input.templateId,
      rawInput: input.rawInput,
      contextValues: input.contextValues,
      workspaceId: input.workspaceId,
    };

    await this.executionLogRepository.save(log);
  }
}
