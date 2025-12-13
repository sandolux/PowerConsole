import { LocalCredentials, User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/repositories/IUserRepository";
import { IPasswordHasher } from "@/core/domain/services/IPasswordHasher";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(credentials: LocalCredentials): Promise<User | null> {
    const user = await this.userRepository.findByUsername(credentials.username);
    if (!user) return null;

    const isValid = await this.passwordHasher.verify(
      credentials.password,
      user.passwordHash
    );

    return isValid ? user : null;
  }
}
