import { Profile } from "../../domain/entities/Profile";
import { IProfileRepository } from "../../repositories/IProfileRepository";

export class CreateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(profileData: Omit<Profile, 'id' | 'createdAt'>): Promise<void> {
    if (!profileData.name || !profileData.workspaceId || !profileData.type) {
      throw new Error("Missing required profile data: name, workspaceId, and type.");
    }

    const newProfile: Profile = {
      ...profileData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    await this.profileRepository.create(newProfile);
  }
}
