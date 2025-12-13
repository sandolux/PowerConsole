"use client";

import { useSqlRunner } from '@/presentation/hooks/useSqlRunner';
import { useProfiles } from '@/presentation/hooks/useProfiles';
import { Clipboard, Play } from 'lucide-react';
import { CompactLogList } from '../logs/CompactLogList';

export const SqlRunner = ({ workspaceId }: { workspaceId: string }) => {
  const {
    selectedProfileId,
    setSelectedProfileId,
    selectedTemplateId,
    setSelectedTemplateId,
    availableProfiles,
    inputData,
    setInputData,
    generatedScript,
    templates,
    contextValues,
    useLoopMode,
    handleGenerate,
    handleContextChange,
    setUseLoopMode,
    copyToClipboard,
    restoreStateFromLog,
    logReloadKey,
  } = useSqlRunner(workspaceId);

  const { profiles, loading: profilesLoading } = useProfiles(workspaceId);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const contextParams = selectedTemplate?.parameters.filter((p) => !p.isBatchParam) ?? [];
  const batchParamName = selectedTemplate?.parameters.find((p) => p.isBatchParam)?.name ?? 'el Batch Param';
  const hasBatchParam = Boolean(selectedTemplate?.parameters.some((p) => p.isBatchParam));
  const hasBatchValues = inputData.trim().length > 0;
  const showLoopToggle = hasBatchParam && hasBatchValues;

  const inputClasses = "block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="profile" className={labelClasses}>
            Connection Profile
          </label>
          <select
            id="profile"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className={inputClasses}
            disabled={profilesLoading}
          >
            <option value="">{profilesLoading ? 'Loading...' : 'Select a profile'}</option>
            {availableProfiles.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {selectedTemplate?.allowedProfileIds && selectedTemplate.allowedProfileIds.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              Mostrando {availableProfiles.length} de {profiles.length} perfiles (Restringido por Template)
            </p>
          )}
        </div>
        <div>
          <label htmlFor="template" className={labelClasses}>
            Script Template
          </label>
          <select
            id="template"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className={inputClasses}
            disabled={templates.length === 0}
          >
            {templates.length === 0 ? (
                <option value="">No templates defined.</option>
            ) : (
                templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))
            )}
          </select>
          {templates.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
                No hay templates definidos. Ve a la pestaña{' '}
                <a href="#" onClick={() => {/* TODO: Navigate to Templates tab */}} className="text-indigo-600 hover:underline">Templates</a>{' '}
                para crear uno.
            </p>
          )}
        </div>
      </div>

      {/* Main Area - 3-column responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Área 1: Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-data" className={labelClasses}>
              Input Data (Codes/Params)
            </label>
            <span className="text-xs text-slate-500">Ingresa valores para {batchParamName}</span>
          </div>
          <textarea
            id="input-data"
            rows={16}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="font-mono p-4 rounded-md w-full h-96 block border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Pega tu lista de códigos aquí, uno por línea..."
          />
        </div>

        {/* Área 2: Configuración de Contexto */}
        <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold text-slate-800">Configuración de Ejecución</h4>
          {contextParams.length === 0 && (
            <p className="text-sm text-slate-500">Este template no tiene parámetros de contexto adicionales.</p>
          )}
          {contextParams.map((param) => {
            const isIxDesp = param.name.toLowerCase() === '@ix_desp';
            const isSwitch = param.name.toLowerCase() === '@sw' || param.type === 'boolean';
            return (
              <div key={param.name} className="space-y-1">
                <label className={labelClasses}>{param.name}</label>
                {isSwitch ? (
                  <select
                    value={String(contextValues[param.name] ?? '')}
                    onChange={(e) => handleContextChange(param.name, e.target.value === 'true')}
                    className={inputClasses}
                  >
                    <option value="true">On</option>
                    <option value="false">Off</option>
                  </select>
                ) : (
                  <input
                    type={isIxDesp || param.type === 'number' ? 'number' : 'text'}
                    value={contextValues[param.name] ?? ''}
                    onChange={(e) => handleContextChange(
                      param.name,
                      (isIxDesp || param.type === 'number') && e.target.value !== '' ? Number(e.target.value) : e.target.value
                    )}
                    className={inputClasses}
                    placeholder={isIxDesp ? 'ID de despacho' : ''}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Área 3: Output */}
        <div>
          <label htmlFor="generated-script" className={labelClasses}>
            Script Generado
          </label>
          <textarea
            id="generated-script"
            rows={16}
            value={generatedScript}
            readOnly
            className="font-mono p-4 rounded-md w-full h-96 block bg-slate-900 text-green-400 border-slate-700 shadow-sm sm:text-sm"
            placeholder="-- El SQL generado aparecerá aquí..."
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
        {showLoopToggle && (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={useLoopMode}
              onChange={(e) => setUseLoopMode(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            Usar modo bucle (cursor)
          </label>
        )}
        <button 
            onClick={copyToClipboard}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
        >
            <Clipboard size={16} />
            Copy to Clipboard
        </button>
        <button
            onClick={handleGenerate}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <Play size={16} />
            Actualizar ahora
        </button>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Historial reciente</p>
        <CompactLogList workspaceId={workspaceId} onRestore={restoreStateFromLog} reloadSignal={logReloadKey} />
      </div>
    </div>
  );
};
