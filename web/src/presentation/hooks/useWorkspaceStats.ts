"use client";

import { useEffect, useState, useCallback } from "react";
import { useDi } from "@/presentation/context/DiContext";
import { WorkspaceStats } from "@/core/domain/entities/WorkspaceStats";

export const useWorkspaceStats = (workspaceId: string) => {
  const { getWorkspaceStatsUseCase } = useDi();
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkspaceStatsUseCase.execute(workspaceId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching stats");
    } finally {
      setLoading(false);
    }
  }, [getWorkspaceStatsUseCase, workspaceId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return { stats, loading, error, reload: loadStats };
};
