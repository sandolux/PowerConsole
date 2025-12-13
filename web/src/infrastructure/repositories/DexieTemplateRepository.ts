import { ITemplateRepository } from "../../../core/repositories/ITemplateRepository";
import { Template } from "../../../core/domain/entities/Template";
import { db } from "../persistence/db";

export class DexieTemplateRepository implements ITemplateRepository {
  async getAll(): Promise<Template[]> {
    return await db.templates.toArray();
  }

  async getById(id: string): Promise<Template | null> {
    const template = await db.templates.get(id);
    return template ?? null;
  }

  async save(template: Template): Promise<void> {
    await db.templates.put(template);
  }

  async delete(id: string): Promise<void> {
    await db.templates.delete(id);
  }

  async getByWorkspaceId(workspaceId: string): Promise<Template[]> {
    return await db.templates.where({ workspaceId }).toArray();
  }
}
