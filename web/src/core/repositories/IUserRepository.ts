import { User } from "../domain/entities/User";

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<void>;
}
