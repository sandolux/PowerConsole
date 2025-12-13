import { IScriptGenerator } from '../domain/services/IScriptGenerator';
import { ScriptTemplate, ScriptParameter } from '../domain/entities/ScriptTemplate';

export class SqlScriptGeneratorService implements IScriptGenerator {
  private static readonly INDENT = "\n\t";

  generate(
    template: ScriptTemplate,
    rawInput: string,
    contextValues: Record<string, string | number | boolean>,
    useLoopMode: boolean = false
  ): string {
    if (!rawInput.trim()) {
      return '';
    }

    const header = `-- Generado por PowerConsole el ${new Date().toLocaleString()}\n\n`;

    const lines = rawInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const batchParam = template.parameters.find(p => p.isBatchParam);
    const nonBatchParams = template.parameters.filter(p => !p.isBatchParam);

    if (useLoopMode) {
      const valuesList = lines
        .map(line => `('${escapeSingleQuotes(line)}')`)
        .join(',\n');

      const nonBatchAssignments = nonBatchParams.map((param, idx) => {
        const formattedValue = formatParamValue(param, contextValues[param.name]);
        const suffix = idx === nonBatchParams.length - 1 ? ';' : ',';
        return `${SqlScriptGeneratorService.INDENT}${param.name} = ${formattedValue}${suffix}`;
      }).join('');

      const execLine = [
        `${batchParam?.name ?? '@BatchParam'} = @CurrentBatchValue${nonBatchParams.length === 0 ? ';' : ','}`,
        nonBatchAssignments
      ].join('');

      const loopScript = `
DECLARE @BatchList TABLE (Value VARCHAR(MAX));

INSERT INTO @BatchList (Value)
VALUES
${valuesList};

DECLARE @CurrentBatchValue VARCHAR(MAX);
DECLARE batch_cursor CURSOR FOR SELECT Value FROM @BatchList;

OPEN batch_cursor;
FETCH NEXT FROM batch_cursor INTO @CurrentBatchValue;

WHILE @@FETCH_STATUS = 0
BEGIN
    EXEC ${template.spName}${SqlScriptGeneratorService.INDENT}${execLine}
    FETCH NEXT FROM batch_cursor INTO @CurrentBatchValue;
END

CLOSE batch_cursor;
DEALLOCATE batch_cursor;`.trim();

      return header + loopScript;
    }

    const script = lines
      .map(line => {
        const paramAssignments = template.parameters.map((param: ScriptParameter, idx) => {
          const valueForParam = param.isBatchParam ? line : contextValues[param.name];
          const formattedValue = formatParamValue(param, valueForParam);
        const suffix = idx === template.parameters.length - 1 ? ';' : ',';
        return `${SqlScriptGeneratorService.INDENT}${param.name} = ${formattedValue}${suffix}`;
      }).join('');

        return `EXEC ${template.spName}${paramAssignments}`;
      })
      .join('\n\n');

    return header + script;
  }
}

const formatParamValue = (param: ScriptParameter, value: string | number | boolean | undefined) => {
  const resolved = value ?? '';

  if (param.type === 'number') {
    return `${resolved}`;
  }

  if (param.type === 'boolean') {
    return (resolved as boolean) ? '1' : '0';
  }

  // For text/hidden and fallbacks, wrap as string literal
  return `'${escapeSingleQuotes(String(resolved))}'`;
};

const escapeSingleQuotes = (value: string) => value.replace(/'/g, "''");
