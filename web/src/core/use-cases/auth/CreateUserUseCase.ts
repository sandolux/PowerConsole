import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/repositories/IUserRepository";

// Simplified user creation (stores password as-is in passwordHash for prototype)
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: Omit<User, "passwordHash"> & { password: string }): Promise<User> {
    const entity: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.password, // TODO: replace with real hashing
    };
    await this.userRepository.create(entity);
    return entity;
  }
}
