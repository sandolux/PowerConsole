import { IScriptTemplateRepository } from "../../core/repositories/IScriptTemplateRepository";
import { ScriptTemplate } from "../../core/domain/entities/ScriptTemplate";
import { db } from "../persistence/db";

export class DexieScriptTemplateRepository implements IScriptTemplateRepository {
  async getByWorkspaceId(workspaceId: string): Promise<ScriptTemplate[]> {
    return await db.scriptTemplates.where({ workspaceId }).toArray();
  }

  async save(template: ScriptTemplate): Promise<void> {
    await db.scriptTemplates.put(template);
  }

  async delete(id: string): Promise<void> {
    await db.scriptTemplates.delete(id);
  }
}
