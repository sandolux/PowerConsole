"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDi } from '../context/DiContext';
import { ExecutionLog } from '@/core/domain/entities/ExecutionLog';

export const useLogs = (workspaceId: string) => {
  const { executionLogRepo } = useDi();
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await executionLogRepo.getByWorkspaceId(workspaceId);
      setLogs(data);
    } catch (err) {
      setError('No se pudieron cargar los logs.');
    } finally {
      setLoading(false);
    }
  }, [executionLogRepo, workspaceId]);

  useEffect(() => {
    if (workspaceId) {
      loadLogs();
    }
  }, [workspaceId, loadLogs]);

  return { logs, loading, error, reload: loadLogs };
};
