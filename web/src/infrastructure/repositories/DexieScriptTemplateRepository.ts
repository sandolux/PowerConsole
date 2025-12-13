import { IScriptTemplateRepository } from "../../core/repositories/IScriptTemplateRepository";
import { ScriptTemplate } from "../../core/domain/entities/ScriptTemplate";
import { db } from "../persistence/db";

export class DexieScriptTemplateRepository implements IScriptTemplateRepository {
  async getByWorkspaceId(workspaceId: string): Promise<ScriptTemplate[]> {
    const templates = await db.scriptTemplates.where({ workspaceId }).toArray();
    return templates.map(t => ({
      ...t,
      allowedProfileIds: t.allowedProfileIds ?? [],
    }));
  }

  async save(template: ScriptTemplate): Promise<void> {
    await db.scriptTemplates.put({
      ...template,
      allowedProfileIds: template.allowedProfileIds ?? [],
    });
  }

  async delete(id: string): Promise<void> {
    await db.scriptTemplates.delete(id);
  }
}
