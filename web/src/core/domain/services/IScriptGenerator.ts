import { ScriptTemplate } from '../entities/ScriptTemplate';

export interface IScriptGenerator {
  generate(
    template: ScriptTemplate,
    rawInput: string,
    contextValues: Record<string, string | number | boolean>,
    useLoopMode?: boolean,
  ): string;
}
