import { Workspace } from '../../../core/domain/entities/Workspace';

export interface IWorkspaceRepository {
  getAll(): Promise<Workspace[]>;
  getById(id: string): Promise<Workspace | null>;
  save(workspace: Workspace): Promise<void>;
  delete(id: string): Promise<void>;
}
