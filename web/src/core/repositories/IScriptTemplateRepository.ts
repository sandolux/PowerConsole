import { ScriptTemplate } from '../domain/entities/ScriptTemplate';

export interface IScriptTemplateRepository {
  getByWorkspaceId(workspaceId: string): Promise<ScriptTemplate[]>;
  save(template: ScriptTemplate): Promise<void>;
  delete(id: string): Promise<void>;
}
