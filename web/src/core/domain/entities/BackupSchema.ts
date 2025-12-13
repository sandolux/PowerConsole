import { Workspace } from "./Workspace";
import { Profile } from "./Profile";
import { WorkspaceVariable } from "./WorkspaceVariable";
import { ScriptTemplate } from "./ScriptTemplate";
import { ExecutionLog } from "./ExecutionLog";

export interface WorkspaceBackup {
  version: number;
  exportedAt: string; // ISO string
  workspace: Workspace;
  profiles: Profile[];
  variables: WorkspaceVariable[];
  templates: ScriptTemplate[];
  logs: ExecutionLog[];
}
