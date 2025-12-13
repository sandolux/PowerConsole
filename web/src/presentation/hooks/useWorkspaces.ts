"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDi } from '../context/DiContext';
import { Workspace, WorkspaceEnvironment } from '../../core/domain/entities/Workspace';

export const useWorkspaces = () => {
  const { workspaceRepo } = useDi();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback ensures this function has a stable reference across re-renders
  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspaceRepo.getAll();
      setWorkspaces(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to load workspaces: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [workspaceRepo]);

  // Load workspaces on initial mount
  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const createWorkspace = async (
    name: string,
    description: string,
    environments: WorkspaceEnvironment[],
    color?: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newWorkspace: Workspace = {
        id: crypto.randomUUID(), // Standard browser API for UUIDs
        name,
        description,
        environments,
        createdAt: new Date(),
        color,
      };
      await workspaceRepo.save(newWorkspace);
      await loadWorkspaces(); // Refresh the list from the source of truth
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to create workspace: ${message}`);
      // Re-throw the error to allow caller (e.g., a form) to handle it
      throw err;
    } finally {
      // Don't set loading to false here, as loadWorkspaces will handle it
    }
  };

  const deleteWorkspace = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await workspaceRepo.delete(id);
      await loadWorkspaces(); // Refresh the list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to delete workspace: ${message}`);
      throw err;
    } finally {
      // loadWorkspaces will set loading to false
    }
  };

  return {
    // State
    workspaces,
    loading,
    error,
    // Actions
    loadWorkspaces,
    createWorkspace,
    deleteWorkspace,
  };
};
