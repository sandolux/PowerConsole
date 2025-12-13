import { ScriptTemplate, ScriptParameter } from "../domain/entities/ScriptTemplate";

export class SqlParserService {
  parseFromRaw(rawSql: string): Partial<ScriptTemplate> {
    const spNameMatch = rawSql.match(/(?:EXEC|EXECUTE)\s+(\w+)/i);
    const spName = spNameMatch ? spNameMatch[1] : '';

    const parameterMatches = rawSql.matchAll(/@(\w+)\s*=\s*('[^']*'|\d+\.?\d*|TRUE|FALSE)/gi);
    const parameters: ScriptParameter[] = [];

    for (const match of parameterMatches) {
      const name = `@${match[1]}`;
      let value: string | number | boolean = match[2];
      let type: ScriptParameter['type'] = 'text';
      let isBatchParam = false;

      if (typeof value === 'string') {
        // Remove quotes for text values
        if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
          type = 'text';
        } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
          type = 'boolean';
          value = value.toLowerCase() === 'true';
        } else if (!isNaN(Number(value))) {
          type = 'number';
          value = Number(value);
        }
      }
      
      // Special Business Rules
      if (name.toLowerCase() === '@prem') {
        type = 'hidden';
        value = 0;
      }
      if (name.toLowerCase().includes('txt') || name.toLowerCase().includes('cod')) {
        isBatchParam = true;
      }

      parameters.push({
        name,
        defaultValue: value,
        type,
        isBatchParam,
      });
    }

    return {
      spName,
      parameters,
      rawSqlBody: rawSql,
      name: '', // Will be filled by UI
      description: '', // Will be filled by UI
    };
  }
}
