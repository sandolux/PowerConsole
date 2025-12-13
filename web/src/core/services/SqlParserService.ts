import { ScriptTemplate, ScriptParameter } from "../domain/entities/ScriptTemplate";

export class SqlParserService {
  parseFromRaw(rawSql: string): Partial<ScriptTemplate> {
    const trimmed = rawSql.trim();
    const isExec = /^(exec|execute)\b/i.test(trimmed);
    const { spName, parameters } = isExec
      ? this.parseExecCall(trimmed)
      : this.parseDeclaration(trimmed);

    return {
      spName,
      parameters,
      rawSqlBody: rawSql,
      name: '', // Will be filled by UI
      description: '', // Will be filled by UI
    };
  }

  private parseExecCall(rawSql: string): { spName: string; parameters: ScriptParameter[] } {
    const spNameMatch = rawSql.match(/(?:EXEC|EXECUTE)\s+(\w+)/i);
    const spName = spNameMatch ? spNameMatch[1] : '';

    const parameterMatches = rawSql.matchAll(/@(\w+)\s*=\s*('[^']*'|\d+\.?\d*|TRUE|FALSE)/gi);
    const parameters: ScriptParameter[] = [];
    let batchParamFound = false;

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
      const isCandidate = name.toLowerCase().includes('txt') || name.toLowerCase().includes('cod');
      if (isCandidate && !batchParamFound) {
        isBatchParam = true;
        batchParamFound = true;
      }

      parameters.push({
        name,
        defaultValue: value,
        type,
        isBatchParam,
      });
    }
    return { spName, parameters };
  }

  private parseDeclaration(rawSql: string): { spName: string; parameters: ScriptParameter[] } {
    // 1. Nombre del SP
    const nameMatch = rawSql.match(/^([\[\]\w\.]+)\s*\(/);
    const rawName = nameMatch ? nameMatch[1] : '';
    const spName = rawName.replace(/[\[\]]/g, '').replace(/^dbo\./i, '');

    // 2. Cuerpo entre paréntesis (primer "(" y último ")")
    const parenMatch = rawSql.match(/\(([\s\S]*?)\)/m);
    const inside = parenMatch ? parenMatch[1] : '';

    // 3. Regex por parámetro
    const lines = inside
      .split(/,(?![^'"]*['"])/) // split by commas not inside quotes
      .flatMap(l => l.split(/\r?\n/))
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const paramRegex = /(@\w+)\s+([\w\(\)]+)(?:\s*=\s*([^,\r\n-]+))?(?:\s*--\s*(.*)|\s*-\s*(.*))?/i;

    const parameters: ScriptParameter[] = [];
    let batchParamFound = false;

    for (const line of lines) {
      const match = line.match(paramRegex);
      if (!match) continue;

      const name = match[1];
      const sqlType = (match[2] || '').toLowerCase();
      const rawDefault = match[3]?.trim();
      const comment = (match[4] || match[5] || '').trim();

      let type: ScriptParameter['type'] = this.mapSqlTypeToUi(sqlType);
      let defaultValue: string | number | boolean | undefined = undefined;

      if (rawDefault !== undefined) {
        const cleanedDefault = rawDefault.replace(/^['"]|['"]$/g, '');
        if (/^(true|false)$/i.test(cleanedDefault)) {
          type = 'boolean';
          defaultValue = /^true$/i.test(cleanedDefault);
        } else if (!isNaN(Number(cleanedDefault))) {
          defaultValue = Number(cleanedDefault);
        } else {
          defaultValue = cleanedDefault;
        }
      }

      const lowerName = name.toLowerCase();
      let isBatchParam = false;
      const isCandidate = ['txt', 'cod', 'bar', 'id'].some(tag => lowerName.includes(tag));
      if (isCandidate && !batchParamFound) {
        isBatchParam = true;
        batchParamFound = true;
      }

      parameters.push({
        name,
        defaultValue,
        type,
        isBatchParam,
        // comment could be stored in a future extension if needed
      });
    }

    return { spName, parameters };
  }

  private mapSqlTypeToUi(sqlType: string): ScriptParameter['type'] {
    const normalized = sqlType.toLowerCase();
    if (/(int|bigint|smallint|tinyint|numeric|decimal|float|money)/.test(normalized)) {
      return 'number';
    }
    if (/bit/.test(normalized)) {
      return 'boolean';
    }
    if (/(varchar|nvarchar|char|text|date|datetime)/.test(normalized)) {
      return 'text';
    }
    return 'text';
  }
}
