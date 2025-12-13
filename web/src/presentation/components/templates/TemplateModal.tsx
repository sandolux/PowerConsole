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
        const cleanedParameters = (() => {
          const params = templateToEdit.parameters || [];
          let found = false;
          return params.map((p) => {
            if (p.isBatchParam && !found) {
              found = true;
              return { ...p, isBatchParam: true };
            }
            return { ...p, isBatchParam: false };
          });
        })();
        setName(templateToEdit.name);
        setSpName(templateToEdit.spName);
        setDescription(templateToEdit.description || '');
        setRawSqlBody(templateToEdit.rawSqlBody || '');
        setParameters(cleanedParameters);
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

  const handleBatchParamChange = (selectedIndex: number) => {
    setParameters(prevParams => prevParams.map((param, idx) => ({
      ...param,
      isBatchParam: idx === selectedIndex
    })));
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
  const inputClasses =
    "w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Script Template' : 'New Script Template'}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto max-h-[70vh] p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg"> {/* Scrollable content */}
          {/* Section 1: Smart Import */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <label htmlFor="rawSqlInput" className={labelClasses}>Paste SQL for Smart Import</label>
            <textarea
              id="rawSqlInput"
              rows={4} // Reduced height
              value={rawSqlInput}
              onChange={(e) => setRawSqlInput(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-300 rounded-lg p-3 font-mono text-sm transition-colors"
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
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Template Details</h4>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">No hay perfiles en este workspace.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {profiles.map((profile) => (
                    <label key={profile.id} className="inline-flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
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
                        className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                      />
                      {profile.name}
                    </label>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Si no seleccionas ninguno, el template se podrá usar con cualquier perfil.</p>
            </div>
          </div>

          {/* Section 3: Parameters Table */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Parameters</h4>
            {parameters.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">No parameters detected. Paste SQL above to analyze.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Name</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Default Value</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Type</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Batch Param</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {parameters.map((param, index) => (
                      <tr key={param.name} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          <input type="text" value={param.name} readOnly className={`${inputClasses} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`} />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {param.type === 'boolean' ? (
                              <input
                                  type="checkbox"
                                  checked={param.defaultValue as boolean || false}
                                  onChange={(e) => handleParameterChange(index, 'defaultValue', e.target.checked)}
                                  className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
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
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
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
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                          <input
                            type="radio"
                            name="batchParamGroup"
                            checked={param.isBatchParam || false}
                            onChange={() => handleBatchParamChange(index)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
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
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
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
