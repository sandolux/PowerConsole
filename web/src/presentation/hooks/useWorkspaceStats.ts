"use client";

import { useEffect, useState, useCallback } from "react";
import { useDi } from "@/presentation/context/DiContext";
import { WorkspaceStats } from "@/core/domain/entities/WorkspaceStats";

export const useWorkspaceStats = (workspaceId: string) => {
  const { getWorkspaceStatsUseCase } = useDi();
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWorkspaceStatsUseCase.execute(workspaceId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching stats");
    } finally {
      setIsLoading(false);
    }
  }, [getWorkspaceStatsUseCase, workspaceId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return { stats, isLoading, error, refreshStats: loadStats };
};
