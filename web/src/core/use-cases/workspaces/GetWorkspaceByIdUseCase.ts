import { Workspace } from "../../domain/entities/Workspace";
import { IWorkspaceRepository } from "../../repositories/IWorkspaceRepository";

export class GetWorkspaceByIdUseCase {
  constructor(private readonly workspaceRepository: IWorkspaceRepository) {}

  async execute(id: string): Promise<Workspace | undefined> {
    return await this.workspaceRepository.getById(id);
  }
}
