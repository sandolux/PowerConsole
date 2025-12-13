import { Profile } from '../domain/entities/Profile';

export interface IProfileRepository {
  getByWorkspaceId(workspaceId: string): Promise<Profile[]>;
  create(profile: Profile): Promise<void>;
  update(profile: Profile): Promise<void>;
  delete(id: string): Promise<void>;
}
