"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDi } from '../context/DiContext';
import { ScriptTemplate } from '../../core/domain/entities/ScriptTemplate';
import { 
  GetTemplatesByWorkspaceUseCase,
  SaveTemplateUseCase,
  DeleteTemplateUseCase,
} from '../../core/use-cases/templates/ManageTemplatesUseCase';

export const useTemplates = (workspaceId: string) => {
  const { templateRepo } = useDi();
  const [templates, setTemplates] = useState<ScriptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTemplatesUseCase = useMemo(() => new GetTemplatesByWorkspaceUseCase(templateRepo), [templateRepo]);
  const saveTemplateUseCase = useMemo(() => new SaveTemplateUseCase(templateRepo), [templateRepo]);
  const deleteTemplateUseCase = useMemo(() => new DeleteTemplateUseCase(templateRepo), [templateRepo]);

  const reload = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplatesUseCase.execute(workspaceId);
      setTemplates(data);
    } catch (err) {
      setError("Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }, [workspaceId, getTemplatesUseCase]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveTemplate = async (template: ScriptTemplate) => {
    try {
      await saveTemplateUseCase.execute(template);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template.");
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await deleteTemplateUseCase.execute(id);
      await reload();
    } catch (err) {
      setError("Failed to delete template.");
      throw err;
    }
  };

  return {
    templates,
    loading,
    error,
    saveTemplate,
    deleteTemplate,
    reload,
  };
};
