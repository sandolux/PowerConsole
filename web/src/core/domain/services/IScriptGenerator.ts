import { ScriptTemplate } from '../entities/ScriptTemplate';
import { Profile } from '../entities/Profile';

export interface IScriptGenerator {
  generate(
    template: ScriptTemplate,
    rawInput: string,
    contextValues: Record<string, string | number | boolean>,
    useLoopMode?: boolean,
    profile?: Profile,
  ): string;
}
