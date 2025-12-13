"use client";

import { useState } from "react";
import { useTemplates } from "@/presentation/hooks/useTemplates";
import { ScriptTemplate } from "@/core/domain/entities/ScriptTemplate";
import { TemplateModal } from "./TemplateModal";
import { Plus } from "lucide-react";
import { TemplateCard } from "./TemplateCard";

export const TemplateList = ({ workspaceId }: { workspaceId: string }) => {
  const { templates, loading, error, saveTemplate, deleteTemplate } = useTemplates(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ScriptTemplate | null>(null);

  const handleOpenModal = (template?: ScriptTemplate) => {
    setTemplateToEdit(template || null);
    setIsModalOpen(true);
  };

  const handleSave = async (template: ScriptTemplate) => {
    await saveTemplate(template);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          New Template
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
          {templates.length === 0 && (
            <p className="col-span-full text-center text-slate-500 dark:text-gray-400 py-10">
              No templates defined.
            </p>
          )}
        </div>
      )}

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTemplateToEdit(null); }} // Reset templateToEdit on close
        onSave={handleSave}
        templateToEdit={templateToEdit}
        workspaceId={workspaceId}
      />
    </div>
  );
};
