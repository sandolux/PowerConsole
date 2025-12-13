import { ScriptTemplate } from '../../domain/entities/ScriptTemplate';
import { IScriptTemplateRepository } from '../../repositories/IScriptTemplateRepository';

export class GetTemplatesByWorkspaceUseCase {
  constructor(private readonly templateRepository: IScriptTemplateRepository) {}

  async execute(workspaceId: string): Promise<ScriptTemplate[]> {
    return this.templateRepository.getByWorkspaceId(workspaceId);
  }
}

export class SaveTemplateUseCase {
  constructor(private readonly templateRepository: IScriptTemplateRepository) {}

  async execute(template: ScriptTemplate): Promise<void> {
    const hasBatchParam = template.parameters?.some(p => p.isBatchParam);

    if (!template.name?.trim() || !template.spName?.trim()) {
      throw new Error('El nombre del Template y el nombre del SP son obligatorios.');
    }

    if (!template.parameters || template.parameters.length === 0) {
      throw new Error("Debes definir al menos un parámetro (o usar 'Analyze SQL').");
    }

    if (!hasBatchParam) {
      throw new Error("Debes marcar un parámetro como 'Batch Param' (el círculo azul).");
    }
    await this.templateRepository.save(template);
  }
}

export class DeleteTemplateUseCase {
  constructor(private readonly templateRepository: IScriptTemplateRepository) {}

  async execute(id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }
}
