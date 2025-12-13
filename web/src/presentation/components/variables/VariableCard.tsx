import { WorkspaceVariable } from "@/core/domain/entities/WorkspaceVariable";
import { Pencil, Trash2 } from "lucide-react";

interface VariableCardProps {
  variable: WorkspaceVariable;
  onEdit: (variable: WorkspaceVariable) => void;
  onDelete: (id: string) => void;
}

export const VariableCard = ({ variable, onEdit, onDelete }: VariableCardProps) => {
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 relative">
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <button
          onClick={() => onEdit(variable)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Edit variable"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(variable.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Delete variable"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono pr-14">{variable.key}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 break-words">{variable.value}</p>
    </div>
  );
};
