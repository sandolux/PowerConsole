import Dexie, { Table } from 'dexie';
import { Workspace } from '../../core/domain/entities/Workspace';
import { Profile } from '../../core/domain/entities/Profile';
import { Template } from '../../core/domain/entities/Template';
import { ExecutionLog } from '../../core/domain/entities/ExecutionLog';

export class PowerConsoleDB extends Dexie {
  // Declare tables, mapping them to the domain entity interfaces
  workspaces!: Table<Workspace, string>; // 'string' is the type of the primary key 'id'
  profiles!: Table<Profile, string>;
  templates!: Table<Template, string>;
  executionLogs!: Table<ExecutionLog, string>;

  constructor() {
    super('PowerConsoleDB');
    this.version(1).stores({
      workspaces: 'id, name', // Primary key 'id', index 'name'
      profiles: 'id, workspaceId, type', // Primary key 'id', compound indexes possible
      templates: 'id, workspaceId, type',
      executionLogs: 'id, timestamp, runnerType',
    });
  }
}

// Export a singleton instance of the database
export const db = new PowerConsoleDB();
