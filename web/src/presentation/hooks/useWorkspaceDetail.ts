import { useEffect, useState } from "react";
import { useDi } from "../context/DiContext";
import { Workspace } from "@/core/domain/entities/Workspace";
import { GetWorkspaceByIdUseCase } from "@/core/use-cases/workspaces/GetWorkspaceByIdUseCase";

export const useWorkspaceDetail = (workspaceId: string) => {
  const { workspaceRepo: workspaceRepository } = useDi();
  const [workspace, setWorkspace] = useState<Workspace | undefined | null>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      try {
        setLoading(true);
        const getWorkspaceById = new GetWorkspaceByIdUseCase(
          workspaceRepository,
        );
        const fetchedWorkspace = await getWorkspaceById.execute(workspaceId);
        setWorkspace(fetchedWorkspace);
      } catch (err) {
        setError("Failed to fetch workspace details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId, workspaceRepository]);

  return { workspace, loading, error };
};
