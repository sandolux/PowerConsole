"use client";

import { useState } from "react";
import { useVariables } from "@/presentation/hooks/useVariables";
import { WorkspaceVariable } from "@/core/domain/entities/WorkspaceVariable";
import { VariableModal } from "./VariableModal";
import { Plus } from "lucide-react";
import { VariableCard } from "./VariableCard";

export const VariableList = ({ workspaceId }: { workspaceId: string }) => {
  const { variables, loading, error, saveVariable, deleteVariable } = useVariables(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variableToEdit, setVariableToEdit] = useState<WorkspaceVariable | null>(null);

  const handleOpenModal = (variable?: WorkspaceVariable) => {
    setVariableToEdit(variable || null);
    setIsModalOpen(true);
  };

  const handleSave = async (variable: WorkspaceVariable) => {
    await saveVariable(variable);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      await deleteVariable(id);
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
          New Variable
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {variables.map((variable) => (
            <VariableCard
              key={variable.id}
              variable={variable}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
          {variables.length === 0 && (
            <p className="col-span-full text-center text-slate-500 dark:text-gray-400 py-10">
              No variables defined.
            </p>
          )}
        </div>
      )}

      <VariableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        variableToEdit={variableToEdit}
        workspaceId={workspaceId}
      />
    </div>
  );
};
