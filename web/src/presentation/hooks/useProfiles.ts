"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDi } from '../context/DiContext';
import { Profile } from '../../core/domain/entities/Profile';
import { GetProfilesByWorkspaceUseCase } from '../../core/use-cases/profiles/GetProfilesByWorkspaceUseCase';

export const useProfiles = (workspaceId: string) => {
  const { profileRepo } = useDi();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProfilesByWorkspace = useMemo(() => new GetProfilesByWorkspaceUseCase(profileRepo), [profileRepo]);

  const reloadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProfiles = await getProfilesByWorkspace.execute(workspaceId);
      setProfiles(fetchedProfiles);
    } catch (err) {
      setError("Failed to fetch profiles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, getProfilesByWorkspace]);

  useEffect(() => {
    if (workspaceId) {
      reloadProfiles();
    }
  }, [workspaceId, reloadProfiles]);

  return { profiles, loading, error, reloadProfiles };
};
