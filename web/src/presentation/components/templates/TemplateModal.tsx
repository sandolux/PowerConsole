"use client";

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { ScriptTemplate, ScriptParameter } from '@/core/domain/entities/ScriptTemplate';
import { useDi } from '@/presentation/context/DiContext';
import { Sparkles } from 'lucide-react';
import { useProfiles } from '@/presentation/hooks/useProfiles';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ScriptTemplate) => Promise<void>;
  templateToEdit?: ScriptTemplate | null;
  workspaceId: string;
}

export const TemplateModal = ({ isOpen, onClose, onSave, templateToEdit, workspaceId }: TemplateModalProps) => {
  const { sqlParser } = useDi();

  const [name, setName] = useState('');
  const [spName, setSpName] = useState('');
  const [description, setDescription] = useState('');
  const [rawSqlBody, setRawSqlBody] = useState('');
  const [parameters, setParameters] = useState<ScriptParameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawSqlInput, setRawSqlInput] = useState(''); // For the top textarea
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  const { profiles } = useProfiles(workspaceId);

  const isEditMode = !!templateToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && templateToEdit) {
        setName(templateToEdit.name);
        setSpName(templateToEdit.spName);
        setDescription(templateToEdit.description || '');
        setRawSqlBody(templateToEdit.rawSqlBody || '');
        setParameters(templateToEdit.parameters || []);
        setRawSqlInput(templateToEdit.rawSqlBody || '');
        setSelectedProfileIds(templateToEdit.allowedProfileIds || []);
      } else {
        resetForm();
      }
      setError(null);
    }
  }, [isOpen, templateToEdit, isEditMode]);

  const resetForm = () => {
    setName('');
    setSpName('');
    setDescription('');
    setRawSqlBody('');
    setParameters([]);
    setRawSqlInput('');
    setSelectedProfileIds([]);
    setError(null);
    setLoading(false);
  };

  const handleParseSql = () => {
    if (!rawSqlInput.trim()) {
      setError('Please paste some SQL to parse.');
      return;
    }
    try {
      const parsed = sqlParser.parseFromRaw(rawSqlInput);
      setSpName(parsed.spName || '');
      setParameters(parsed.parameters || []);
      setRawSqlBody(rawSqlInput); // Save the original SQL body
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error parsing SQL.');
    }
  };

  const handleParameterChange = (index: number, field: keyof ScriptParameter, value: any) => {
    setParameters(prevParams => {
      const newParams = [...prevParams];
      if (field === 'isBatchParam' && value === true) {
        // Ensure only one isBatchParam can be true
        newParams.forEach((p, i) => {
          if (i !== index) p.isBatchParam = false;
        });
      }
      newParams[index] = { ...newParams[index], [field]: value };
      return newParams;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasBatchParam = parameters.some(p => p.isBatchParam);

    if (!name.trim() || !spName.trim()) {
      setError("El nombre del Template y el nombre del SP son obligatorios.");
      return;
    }

    if (parameters.length === 0) {
      setError("Debes definir al menos un par?metro (o usar 'Analyze SQL').");
      return;
    }

    if (!hasBatchParam) {
      setError("Debes marcar un par?metro como 'Batch Param' (el c?rculo azul).");
      return;
    }
    
    setError(null); // Limpiar error si todo est? bien
    setLoading(true);

    try {
      const templateData: ScriptTemplate = {
        id: isEditMode && templateToEdit ? templateToEdit.id : crypto.randomUUID(),
        workspaceId,
        name,
        spName,
        description,
        parameters,
        rawSqlBody,
        allowedProfileIds: selectedProfileIds,
      };
      await onSave(templateData);
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Script Template' : 'New Script Template'}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto max-h-[70vh] p-4"> {/* Scrollable content */}
          {/* Section 1: Smart Import */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <label htmlFor="rawSqlInput" className={labelClasses}>Paste SQL for Smart Import</label>
            <textarea
              id="rawSqlInput"
              rows={4} // Reduced height
              value={rawSqlInput}
              onChange={(e) => setRawSqlInput(e.target.value)}
              className={`${inputClasses} font-mono`}
              placeholder="e.g., EXEC sp_SomeStoredProcedure @Param1 = 'Value1', @Param2 = 123"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleParseSql}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Sparkles size={16} />
                Analyze SQL
              </button>
            </div>
          </div>

          {/* Section 2: Basic Template Data */}
          <div className="mb-6 space-y-4">
            <h4 className="text-md font-semibold text-slate-800">Template Details</h4>
            <div className="mb-4">
              <label htmlFor="name" className={labelClasses}>Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} required />
            </div>
            <div className="mb-4">
              <label htmlFor="spName" className={labelClasses}>Stored Procedure Name</label>
              <input id="spName" type="text" value={spName} onChange={(e) => setSpName(e.target.value)} className={inputClasses} required />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className={labelClasses}>Description (Optional)</label>
              <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClasses} />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Perfiles Permitidos (Opcional)</label>
              {profiles.length === 0 ? (
                <p className="text-sm text-slate-500">No hay perfiles en este workspace.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {profiles.map((profile) => (
                    <label key={profile.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedProfileIds.includes(profile.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProfileIds(prev => [...prev, profile.id]);
                          } else {
                            setSelectedProfileIds(prev => prev.filter(id => id !== profile.id));
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      {profile.name}
                    </label>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">Si no seleccionas ninguno, el template se podrá usar con cualquier perfil.</p>
            </div>
          </div>

          {/* Section 3: Parameters Table */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-slate-800 mb-3">Parameters</h4>
            {parameters.length === 0 ? (
              <p className="text-sm text-slate-500">No parameters detected. Paste SQL above to analyze.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-2 py-1 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Default Value</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Batch Param</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {parameters.map((param, index) => (
                      <tr key={param.name}>
                        <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-slate-900">
                          <input type="text" value={param.name} readOnly className={`${inputClasses} bg-slate-50 cursor-not-allowed`} />
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-sm text-slate-500">
                          {param.type === 'boolean' ? (
                              <input
                                  type="checkbox"
                                  checked={param.defaultValue as boolean || false}
                                  onChange={(e) => handleParameterChange(index, 'defaultValue', e.target.checked)}
                                  className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                              />
                          ) : (
                              <input
                                  type={param.type === 'number' ? 'number' : 'text'}
                                  value={param.defaultValue?.toString() || ''}
                                  onChange={(e) => handleParameterChange(index, 'defaultValue', e.target.value)}
                                  className={inputClasses}
                              />
                          )}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-sm text-slate-500">
                          <select
                            value={param.type}
                            onChange={(e) => handleParameterChange(index, 'type', e.target.value as ScriptParameter['type'])}
                            className={inputClasses}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="hidden">Hidden</option>
                          </select>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-sm text-slate-500 text-center">
                          <input
                            type="radio"
                            name="batchParam" // Group radio buttons by name
                            checked={param.isBatchParam || false}
                            onChange={(e) => handleParameterChange(index, 'isBatchParam', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-200 bg-white">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
            {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Template')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
