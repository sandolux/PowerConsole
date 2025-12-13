import { Profile } from "../../domain/entities/Profile";
import { IProfileRepository } from "../../repositories/IProfileRepository";

export class GetProfilesByWorkspaceUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(workspaceId: string): Promise<Profile[]> {
    if (!workspaceId) {
      throw new Error("Workspace ID is required.");
    }
    return await this.profileRepository.getByWorkspaceId(workspaceId);
  }
}
