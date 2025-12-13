"use client";

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { WorkspaceVariable } from '@/core/domain/entities/WorkspaceVariable';

interface VariableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variable: WorkspaceVariable) => Promise<void>;
  variableToEdit?: WorkspaceVariable | null;
  workspaceId: string;
}

export const VariableModal = ({ isOpen, onClose, onSave, variableToEdit, workspaceId }: VariableModalProps) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!variableToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setKey(variableToEdit.key);
        setValue(variableToEdit.value);
        setDescription(variableToEdit.description || '');
      } else {
        setKey('');
        setValue('');
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, variableToEdit, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const variableData: WorkspaceVariable = {
        id: isEditMode ? variableToEdit.id : crypto.randomUUID(),
        workspaceId,
        key: key.toUpperCase().replace(/ /g, '_'),
        value,
        description,
      };
      await onSave(variableData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Variable' : 'New Variable'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="key" className={labelClasses}>Key</label>
          <input
            id="key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={inputClasses}
            placeholder="DB_HOST"
            required
            disabled={isEditMode} // Usually, the key should not be editable
          />
        </div>
        <div className="mb-4">
          <label htmlFor="value" className={labelClasses}>Value</label>
          <input
            id="value"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClasses}
            placeholder="localhost"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className={labelClasses}>Description (Optional)</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClasses}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
