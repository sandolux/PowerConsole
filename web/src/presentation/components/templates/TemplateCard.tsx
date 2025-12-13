import { ScriptTemplate } from "@/core/domain/entities/ScriptTemplate";
import { Pencil, Trash2 } from "lucide-react";

interface TemplateCardProps {
  template: ScriptTemplate;
  onEdit: (template: ScriptTemplate) => void;
  onDelete: (id: string) => void;
}

export const TemplateCard = ({ template, onEdit, onDelete }: TemplateCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all p-4 relative h-full">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">
            {template.name}
          </h3>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(template)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Edit template"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Delete template"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{template.description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{template.spName}</p>
    </div>
  );
};
