export type WorkspaceEnvironment = 'DEV' | 'QA' | 'PROD';

export interface Workspace {
  id: string; // UUID
  name: string;
  description: string;
  environments: WorkspaceEnvironment[];
  createdAt: Date;
  color?: string;
}
