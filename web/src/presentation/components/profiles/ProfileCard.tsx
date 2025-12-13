import { Profile } from "@/core/domain/entities/Profile";
import { Database, Globe, Pencil } from "lucide-react";
import { VariableResolverService } from "@/core/services/VariableResolverService";

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
  variableResolver: VariableResolverService;
  variableMap: Record<string, string>;
}

export const ProfileCard = ({ profile, onEdit, variableResolver, variableMap }: ProfileCardProps) => {
  const resolvedHost = variableResolver.resolve(profile.host || "", variableMap);
  const resolvedDb = variableResolver.resolve(profile.database || "", variableMap);
  const resolvedApi = variableResolver.resolve(profile.apiBaseUrl || "", variableMap);

  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 relative">
      <button
        onClick={() => onEdit(profile)}
        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
        aria-label="Editar perfil"
      >
        <Pencil size={16} />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {profile.type === "sql" ? (
            <Database className="h-6 w-6 text-gray-500" />
          ) : (
            <Globe className="h-6 w-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 pr-8">
            {profile.name}
          </h3>
          {profile.type === "sql" ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              Server: {resolvedHost} - DB: {resolvedDb}
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              URL: {resolvedApi}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
