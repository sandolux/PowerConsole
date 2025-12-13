import { WorkspaceVariable } from "../domain/entities/WorkspaceVariable";

export interface IVariableRepository {
  getByWorkspaceId(workspaceId: string): Promise<WorkspaceVariable[]>;
  save(variable: WorkspaceVariable): Promise<void>;
  delete(id: string): Promise<void>;
}
