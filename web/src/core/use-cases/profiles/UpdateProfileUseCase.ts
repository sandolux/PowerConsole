import { Profile } from "../../domain/entities/Profile";
import { IProfileRepository } from "../../repositories/IProfileRepository";

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(profile: Profile): Promise<void> {
    if (!profile.id) {
      throw new Error("Profile ID is required for updating.");
    }
    await this.profileRepository.update(profile);
  }
}
