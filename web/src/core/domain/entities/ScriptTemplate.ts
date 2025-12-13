export interface ScriptParameter {
  name: string; // ej: "@ix_desp"
  defaultValue?: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'hidden';
  isBatchParam?: boolean; // Indicates if this parameter receives a massive list of codes

}

export interface ScriptTemplate {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  spName: string;
  parameters: ScriptParameter[];
  rawSqlBody: string; // To save the original SQL as reference
}
