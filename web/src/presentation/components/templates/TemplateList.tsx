"use client";

import { useMemo, useState } from "react";
import { useTemplates } from "@/presentation/hooks/useTemplates";
import { useProfiles } from "@/presentation/hooks/useProfiles";
import { ScriptTemplate } from "@/core/domain/entities/ScriptTemplate";
import { TemplateModal } from "./TemplateModal";
import { Plus, Search } from "lucide-react";
import { TemplateCard } from "./TemplateCard";

type SortBy = "name" | "lastUsed" | "creationDate";
type SortDirection = "asc" | "desc";

export const TemplateList = ({ workspaceId }: { workspaceId: string }) => {
  const { templates, loading, error, saveTemplate, deleteTemplate } = useTemplates(workspaceId);
  const { profiles } = useProfiles(workspaceId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ScriptTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByProfile, setFilterByProfile] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleOpenModal = (template?: ScriptTemplate) => {
    setTemplateToEdit(template || null);
    setIsModalOpen(true);
  };

  const handleSave = async (template: ScriptTemplate) => {
    await saveTemplate(template);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(id);
    }
  };

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = templates;

    if (term) {
      result = result.filter((t) =>
        [t.name, t.description]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(term))
      );
    }

    if (filterByProfile) {
      result = result.filter((t) => (t.allowedProfileIds || []).includes(filterByProfile));
    }

    const sorted = [...result].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * direction;
      }
      if (sortBy === "lastUsed") {
        const aLast = (a as any).lastUsed ? new Date((a as any).lastUsed).getTime() : 0;
        const bLast = (b as any).lastUsed ? new Date((b as any).lastUsed).getTime() : 0;
        return (aLast - bLast) * direction;
      }
      if (sortBy === "creationDate") {
        const aDate = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
        const bDate = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
        return (aDate - bDate) * direction;
      }
      return 0;
    });

    return sorted;
  }, [templates, searchTerm, filterByProfile, sortBy, sortDirection]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="w-full md:w-auto flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            <option value="name">Sort by: Name</option>
            <option value="lastUsed">Sort by: Last Used</option>
            <option value="creationDate">Sort by: Date</option>
          </select>

          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as SortDirection)}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>

          <select
            value={filterByProfile ?? ""}
            onChange={(e) => setFilterByProfile(e.target.value || null)}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            <option value="">All profiles</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Template
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
          {filteredTemplates.length === 0 && (
            <p className="col-span-full text-center text-slate-500 dark:text-gray-400 py-10">
              No templates found.
            </p>
          )}
        </div>
      )}

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTemplateToEdit(null);
        }} // Reset templateToEdit on close
        onSave={handleSave}
        templateToEdit={templateToEdit}
        workspaceId={workspaceId}
      />
    </div>
  );
};
