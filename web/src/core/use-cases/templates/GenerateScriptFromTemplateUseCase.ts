import { ScriptTemplate } from '../../domain/entities/ScriptTemplate';
import { IScriptTemplateRepository } from '../../repositories/IScriptTemplateRepository';
import { IScriptGenerator } from '../../domain/services/IScriptGenerator';

export class GenerateScriptFromTemplateUseCase {
  constructor(
    private readonly scriptGenerator: IScriptGenerator,
    private readonly templateRepository: IScriptTemplateRepository,
  ) {}

  async execute(
    templateId: string,
    input: string,
    workspaceId: string,
    contextValues: Record<string, string | number | boolean>,
    useLoopMode: boolean = false,
  ): Promise<string> {
    const templates = await this.templateRepository.getByWorkspaceId(workspaceId);
    const template = templates.find(t => t.id === templateId);

    if (!template) {
      throw new Error(`Template with id "${templateId}" not found in this workspace.`);
    }

    return this.scriptGenerator.generate(template, input, contextValues, useLoopMode);
  }
}
