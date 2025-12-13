export interface Template {
  id: string;
  name: string;
  type: 'SP' | 'ENDPOINT';
  workspaceId: string;
  schema: string; // Stringified JSON with input definitions
  executionConfig: string; // Name of the SP or URL of the Endpoint
}
