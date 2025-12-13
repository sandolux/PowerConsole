import { ScriptParameter } from './ScriptTemplate';

export interface Template {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  spName: string;
  parameters: ScriptParameter[];
  rawSqlBody: string;
  allowedProfileIds: string[];
}
