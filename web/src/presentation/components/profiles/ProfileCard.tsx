import { Profile } from "@/core/domain/entities/Profile";
import { Database, Globe, Pencil } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
}

export const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow relative">
      <button
        onClick={() => onEdit(profile)}
        className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <Pencil size={16} />
      </button>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {profile.type === "sql" ? (
            <Database className="h-6 w-6 text-slate-500" />
          ) : (
            <Globe className="h-6 w-6 text-slate-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-md font-semibold text-slate-800 pr-8">
            {profile.name}
          </h3>
          {profile.type === "sql" ? (
            <p className="text-sm text-slate-500 mt-1">
              Server: {profile.host} - DB: {profile.database}
            </p>
          ) : (
            <p className="text-sm text-slate-500 mt-1">
              URL: {profile.apiBaseUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
