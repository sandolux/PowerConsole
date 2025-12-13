import { Template } from '../../../core/domain/entities/Template';

export interface ITemplateRepository {
  getAll(): Promise<Template[]>;
  getById(id: string): Promise<Template | null>;
  save(template: Template): Promise<void>;
  delete(id: string): Promise<void>;
  getByWorkspaceId(workspaceId: string): Promise<Template[]>;
}
