"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDi } from '../context/DiContext';
import { GetTemplatesByWorkspaceUseCase } from '@/core/use-cases/templates/ManageTemplatesUseCase';
import { GenerateScriptFromTemplateUseCase } from '@/core/use-cases/templates/GenerateScriptFromTemplateUseCase';
import { ScriptTemplate } from '@/core/domain/entities/ScriptTemplate';
import { useProfiles } from './useProfiles';
import { ExecutionLog } from '@/core/domain/entities/ExecutionLog';
import { LogExecutionUseCase } from '@/core/use-cases/logs/LogExecutionUseCase';
import { DeleteLogUseCase } from '@/core/use-cases/logs/DeleteLogUseCase';

export const useSqlRunner = (workspaceId: string) => {
  const { scriptGenerator, templateRepo, executionLogRepo, deleteLogUseCase } = useDi();
  
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [inputData, setInputData] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [templates, setTemplates] = useState<ScriptTemplate[]>([]);
  const [contextValues, setContextValues] = useState<Record<string, string | number | boolean>>({});
  const [useLoopMode, setUseLoopMode] = useState(false);
  const { profiles: allProfiles } = useProfiles(workspaceId);
  const [availableProfiles, setAvailableProfiles] = useState<typeof allProfiles>([]);
  const [pendingContextValues, setPendingContextValues] = useState<Record<string, string | number | boolean> | null>(null);
  const [logReloadKey, setLogReloadKey] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);

  const getTemplatesUseCase = useMemo(() => new GetTemplatesByWorkspaceUseCase(templateRepo), [templateRepo]);
  const logExecutionUseCase = useMemo(() => new LogExecutionUseCase(executionLogRepo), [executionLogRepo]);
  const deleteLog = useMemo(() => deleteLogUseCase, [deleteLogUseCase]);

  const reloadTemplates = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const availableTemplates = await getTemplatesUseCase.execute(workspaceId);
      setTemplates(availableTemplates);
      if (availableTemplates.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(availableTemplates[0].id);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  }, [workspaceId, getTemplatesUseCase, selectedTemplateId]);

  useEffect(() => {
    reloadTemplates();
  }, [reloadTemplates]);

  useEffect(() => {
    if (!selectedTemplateId) {
      setContextValues({});
      setAvailableProfiles(allProfiles);
      return;
    }
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    if (!selectedTemplate) {
      setAvailableProfiles(allProfiles);
      return;
    }

    const initialContext: Record<string, string | number | boolean> = {};
    selectedTemplate.parameters
      .filter(p => !p.isBatchParam)
      .forEach(param => {
        initialContext[param.name] = param.defaultValue ?? (param.type === 'boolean' ? false : '');
      });

    if (pendingContextValues) {
      setContextValues(pendingContextValues);
      setPendingContextValues(null);
      setIsRestoring(false);
    } else if (!isRestoring) {
      setContextValues(initialContext);
    }

    if (selectedTemplate.allowedProfileIds && selectedTemplate.allowedProfileIds.length > 0) {
      const filtered = allProfiles.filter(p => selectedTemplate.allowedProfileIds.includes(p.id));
      setAvailableProfiles(filtered);
      if (filtered.length > 0 && !filtered.some(p => p.id === selectedProfileId)) {
        setSelectedProfileId(filtered[0].id);
      }
    } else {
      setAvailableProfiles(allProfiles);
    }
  }, [selectedTemplateId, templates, allProfiles, selectedProfileId]);

  const handleContextChange = (name: string, value: string | number | boolean) => {
    setContextValues(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedTemplateId || !inputData) {
      setGeneratedScript('-- Please select a template and provide input data.');
      return;
    }
    const selectedProfile = allProfiles.find(p => p.id === selectedProfileId);
    const generateUseCase = new GenerateScriptFromTemplateUseCase(scriptGenerator, templateRepo);
    try {
      const script = await generateUseCase.execute(
        selectedTemplateId,
        inputData,
        workspaceId,
        contextValues,
        useLoopMode,
        selectedProfile
      );
      setGeneratedScript(script);
    } catch (error) {
      setGeneratedScript(`-- Error generating script: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [contextValues, inputData, selectedTemplateId, templateRepo, scriptGenerator, workspaceId, useLoopMode, allProfiles, selectedProfileId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleGenerate();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [handleGenerate, inputData, useLoopMode, contextValues, selectedProfileId, selectedTemplateId]);

  const copyToClipboard = async () => {
    if (!generatedScript) return;

    try {
      await navigator.clipboard.writeText(generatedScript);
      const selectedProfile = allProfiles.find(p => p.id === selectedProfileId);
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

      if (selectedProfile && selectedTemplate) {
        await logExecutionUseCase.execute({
          workspaceId,
          runnerType: 'sql-runner',
          status: 'SUCCESS',
          durationMs: 0,
          summary: `Copiado desde ${selectedTemplate.name}`,
          scriptGenerated: generatedScript,
          profileId: selectedProfile.id,
          templateId: selectedTemplate.id,
          rawInput: inputData,
          contextValues,
          useLoopMode,
        });
        setLogReloadKey(key => key + 1);
      }
    } catch (err) {
      console.error('Failed to copy and log execution:', err);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await deleteLog.execute(id);
      setLogReloadKey(key => key + 1);
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  return {
    selectedProfileId,
    setSelectedProfileId,
    selectedTemplateId,
    setSelectedTemplateId,
    availableProfiles,
    inputData,
    setInputData,
    generatedScript,
    templates,
    contextValues,
    useLoopMode,
    handleGenerate,
    handleContextChange,
    setUseLoopMode,
    copyToClipboard,
    handleDeleteLog,
    restoreStateFromLog: (log: ExecutionLog) => {
      setIsRestoring(true);
      setSelectedProfileId(log.profileId);
      setSelectedTemplateId(log.templateId);
    setInputData(log.rawInput);
      setContextValues((log.contextValues as Record<string, string | number | boolean>) || {});
      setPendingContextValues((log.contextValues as Record<string, string | number | boolean>) || {});
      setUseLoopMode(log.useLoopMode ?? false);
    },
    reloadLogs: () => setLogReloadKey(key => key + 1),
    logReloadKey,
  };
};
