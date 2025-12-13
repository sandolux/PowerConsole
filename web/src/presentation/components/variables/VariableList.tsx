"use client";

import { useState } from 'react';
import { useVariables } from '@/presentation/hooks/useVariables';
import { WorkspaceVariable } from '@/core/domain/entities/WorkspaceVariable';
import { VariableModal } from './VariableModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <ul role="list" className="divide-y divide-slate-200">
            {variables.map((variable) => (
              <li key={variable.id} className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 font-mono">{variable.key}</p>
                  <p className="text-sm text-slate-500 truncate mt-1">{variable.value}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => handleOpenModal(variable)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(variable.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
           {variables.length === 0 && (
            <p className="text-center text-slate-500 py-10">No variables defined.</p>
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
