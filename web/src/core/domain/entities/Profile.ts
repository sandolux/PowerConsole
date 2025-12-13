export interface Profile {
  id: string;
  workspaceId: string;
  name: string;
  type: 'sql' | 'rest';
  createdAt: Date;

  // Optional connection properties
  host?: string;
  database?: string;
  user?: string;
  password?: string; // Should be stored encrypted
  port?: number;
  apiBaseUrl?: string;
}