import { IVariableRepository } from "../../core/repositories/IVariableRepository";
import { WorkspaceVariable } from "../../core/domain/entities/WorkspaceVariable";
import { db } from "../persistence/db";

export class DexieVariableRepository implements IVariableRepository {
  async getByWorkspaceId(workspaceId: string): Promise<WorkspaceVariable[]> {
    return await db.variables.where({ workspaceId }).toArray();
  }

  async save(variable: WorkspaceVariable): Promise<void> {
    await db.variables.put(variable);
  }

  async delete(id: string): Promise<void> {
    await db.variables.delete(id);
  }
}
