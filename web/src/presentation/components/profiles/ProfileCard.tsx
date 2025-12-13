import { Profile } from "@/core/domain/entities/Profile";
import { Database, Globe, Pencil } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
}

export const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 hover:shadow-md hover:scale-[1.01] transition-all relative h-full">
      <button
        onClick={() => onEdit(profile)}
        className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
        aria-label="Editar perfil"
      >
        <Pencil size={16} />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {profile.type === "sql" ? (
            <Database className="h-6 w-6 text-slate-500" />
          ) : (
            <Globe className="h-6 w-6 text-slate-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 pr-8">
            {profile.name}
          </h3>
          {profile.type === "sql" ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Server: {profile.host} - DB: {profile.database}
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              URL: {profile.apiBaseUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
