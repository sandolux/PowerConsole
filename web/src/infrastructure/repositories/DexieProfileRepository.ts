import { IProfileRepository } from "../../core/repositories/IProfileRepository";
import { Profile } from "../../core/domain/entities/Profile";
import { db } from "../persistence/db";

export class DexieProfileRepository implements IProfileRepository {
  async getByWorkspaceId(workspaceId: string): Promise<Profile[]> {
    return await db.profiles.where({ workspaceId }).toArray();
  }

  async create(profile: Profile): Promise<void> {
    await db.profiles.add(profile);
  }

  async update(profile: Profile): Promise<void> {
    await db.profiles.put(profile);
  }

  async delete(id: string): Promise<void> {
    await db.profiles.delete(id);
  }
}
