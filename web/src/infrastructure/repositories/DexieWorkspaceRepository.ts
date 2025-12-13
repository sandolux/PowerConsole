import { IWorkspaceRepository } from "../../../core/repositories/IWorkspaceRepository";
import { Workspace } from "../../../core/domain/entities/Workspace";
import { db } from "../persistence/db";

export class DexieWorkspaceRepository implements IWorkspaceRepository {
  async getAll(): Promise<Workspace[]> {
    return await db.workspaces.toArray();
  }

  async getById(id: string): Promise<Workspace | undefined> {
    const workspace = await db.workspaces.get(id);
    return workspace;
  }

  async save(workspace: Workspace): Promise<void> {
    await db.workspaces.put(workspace);
  }

  async delete(id: string): Promise<void> {
    await db.workspaces.delete(id);
  }
}
