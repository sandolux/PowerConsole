import { IExecutionLogRepository } from "../../repositories/IExecutionLogRepository";

export class DeleteLogUseCase {
  constructor(private readonly executionLogRepository: IExecutionLogRepository) {}

  async execute(id: string): Promise<void> {
    await this.executionLogRepository.delete(id);
  }
}
