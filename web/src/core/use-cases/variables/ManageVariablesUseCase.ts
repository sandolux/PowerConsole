import { WorkspaceVariable } from "../../domain/entities/WorkspaceVariable";
import { IVariableRepository } from "../../repositories/IVariableRepository";

export class GetVariablesByWorkspaceUseCase {
  constructor(private readonly variableRepository: IVariableRepository) {}

  async execute(workspaceId: string): Promise<WorkspaceVariable[]> {
    return this.variableRepository.getByWorkspaceId(workspaceId);
  }
}

export class SaveVariableUseCase {
  constructor(private readonly variableRepository: IVariableRepository) {}

  async execute(variable: WorkspaceVariable): Promise<void> {
    if (!variable.key) {
      throw new Error("Variable key cannot be empty.");
    }
    await this.variableRepository.save(variable);
  }
}

export class DeleteVariableUseCase {
  constructor(private readonly variableRepository: IVariableRepository) {}

  async execute(id: string): Promise<void> {
    await this.variableRepository.delete(id);
  }
}
