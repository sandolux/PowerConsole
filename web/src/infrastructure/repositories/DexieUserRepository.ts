import { IUserRepository } from "@/core/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { db } from "@/infrastructure/persistence/db";

export class DexieUserRepository implements IUserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const user = await db.users.where({ username }).first();
    return user ?? null;
  }

  async create(user: User): Promise<void> {
    await db.users.put(user);
  }
}
