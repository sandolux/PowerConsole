"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDi } from '../context/DiContext';
import { WorkspaceVariable } from '../../core/domain/entities/WorkspaceVariable';
import { 
  GetVariablesByWorkspaceUseCase,
  SaveVariableUseCase,
  DeleteVariableUseCase,
} from '../../core/use-cases/variables/ManageVariablesUseCase';

export const useVariables = (workspaceId: string) => {
  const { variableRepo } = useDi();
  const [variables, setVariables] = useState<WorkspaceVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getVariablesUseCase = useMemo(() => new GetVariablesByWorkspaceUseCase(variableRepo), [variableRepo]);
  const saveVariableUseCase = useMemo(() => new SaveVariableUseCase(variableRepo), [variableRepo]);
  const deleteVariableUseCase = useMemo(() => new DeleteVariableUseCase(variableRepo), [variableRepo]);

  const reload = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getVariablesUseCase.execute(workspaceId);
      setVariables(data);
    } catch (err) {
      setError("Failed to load variables.");
    } finally {
      setLoading(false);
    }
  }, [workspaceId, getVariablesUseCase]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveVariable = async (variable: WorkspaceVariable) => {
    try {
      await saveVariableUseCase.execute(variable);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save variable.");
      throw err;
    }
  };

  const deleteVariable = async (id: string) => {
    try {
      await deleteVariableUseCase.execute(id);
      await reload();
    } catch (err) {
      setError("Failed to delete variable.");
      throw err;
    }
  };

  return {
    variables,
    loading,
    error,
    saveVariable,
    deleteVariable,
    reload,
  };
};
