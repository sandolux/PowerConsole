import Dexie, { Table } from 'dexie';
import { Workspace } from '../../core/domain/entities/Workspace';
import { Profile } from '../../core/domain/entities/Profile';
import { ScriptTemplate } from '../../core/domain/entities/ScriptTemplate';
import { ExecutionLog } from '../../core/domain/entities/ExecutionLog';
import { WorkspaceVariable } from '../../core/domain/entities/WorkspaceVariable';

export class PowerConsoleDB extends Dexie {
  // Declare tables, mapping them to the domain entity interfaces
  workspaces!: Table<Workspace, string>; // 'string' is the type of the primary key 'id'
  profiles!: Table<Profile, string>;
  scriptTemplates!: Table<ScriptTemplate, string>;
  executionLogs!: Table<ExecutionLog, string>;
  variables!: Table<WorkspaceVariable, string>;

  constructor() {
    super('PowerConsoleDB');
    this.version(3).stores({
      workspaces: 'id, name', // Primary key 'id', index 'name'
      profiles: 'id, workspaceId, type', // Primary key 'id', compound indexes possible
      scriptTemplates: '++id, workspaceId',
      executionLogs: 'id, timestamp, runnerType',
      variables: '++id, workspaceId, key',
    });
  }
}

// Export a singleton instance of the database
export const db = new PowerConsoleDB();
