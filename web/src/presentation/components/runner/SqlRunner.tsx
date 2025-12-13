import { useEffect, useMemo, useState } from 'react';
import { useSqlRunner } from '@/presentation/hooks/useSqlRunner';
import { useProfiles } from '@/presentation/hooks/useProfiles';
import { Clipboard, Play, ScanBarcode } from 'lucide-react'; // Añadir ScanBarcode
import { CompactLogList } from '../logs/CompactLogList';
import { Modal } from '../ui/Modal'; // Importar Modal
import { LabelViewer } from '../tools/LabelViewer'; // Importar LabelViewer

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
    handleDeleteLog,
  } = useSqlRunner(workspaceId);

  const { profiles, loading: profilesLoading } = useProfiles(workspaceId);
  const [profileWarning, setProfileWarning] = useState<string | null>(null);
  const [showLabelViewerModal, setShowLabelViewerModal] = useState(false); // Estado para el modal

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const contextParams = selectedTemplate?.parameters.filter((p) => !p.isBatchParam) ?? [];
  const batchParamName = selectedTemplate?.parameters.find((p) => p.isBatchParam)?.name ?? 'el Batch Param';
  const hasBatchParam = Boolean(selectedTemplate?.parameters.some((p) => p.isBatchParam));
  const hasBatchValues = inputData.trim().length > 0;
  const showLoopToggle = hasBatchParam && hasBatchValues;

  const allowedProfiles = useMemo(() => {
    const allowedIds = selectedTemplate?.allowedProfileIds ?? [];
    if (!allowedIds || allowedIds.length === 0) return profiles;
    return profiles.filter((p) => allowedIds.includes(p.id));
  }, [profiles, selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) {
      setProfileWarning(null);
      return;
    }
    const isAllowed =
      !selectedProfileId ||
      allowedProfiles.some((p) => p.id === selectedProfileId);

    if (!isAllowed) {
      const nextProfileId = allowedProfiles[0]?.id ?? '';
      setSelectedProfileId(nextProfileId);
      setProfileWarning(
        'El perfil previamente seleccionado no está permitido para este Template. Selecciona uno de la lista.'
      );
    } else {
      setProfileWarning(null);
    }
  }, [allowedProfiles, selectedProfileId, selectedTemplate, setSelectedProfileId]);

  useEffect(() => {
    if (!selectedProfileId && allowedProfiles.length === 1) {
      setSelectedProfileId(allowedProfiles[0].id);
    }
  }, [allowedProfiles, selectedProfileId, setSelectedProfileId]);

  const handleInjectCodes = (codes: string[]) => {
    const newCodes = codes.join('\n');
    setInputData((prev) => (prev ? `${prev}\n${newCodes}` : newCodes));
    setShowLabelViewerModal(false);
  };

  const inputClasses =
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-100 shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1";
  
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
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
            {allowedProfiles.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {selectedTemplate?.allowedProfileIds && selectedTemplate.allowedProfileIds.length > 0 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Mostrando {allowedProfiles.length} de {profiles.length} perfiles (Restringido por Template)
            </p>
          )}
          {profileWarning && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{profileWarning}</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
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
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between mb-2"> {/* mb-2 añadido para espacio */}
            <label htmlFor="input-data" className={labelClasses}>
              Input Data (Smart Import)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLabelViewerModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                title="Importar códigos de barra desde Label Viewer"
              >
                <ScanBarcode className="w-4 h-4 mr-2" /> Importar Códigos
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400">Ingresa valores para {batchParamName}</span>
            </div>
          </div>
          <textarea
            id="input-data"
            rows={16}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="font-mono p-4 rounded-md w-full h-96 block bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Pega tu lista de códigos aquí, uno por línea..."
          />
        </div>

        {/* Área 2: Configuración de Contexto */}
        <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuración de Ejecución</h4>
          {contextParams.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">No hay parámetros de contexto (todos son batch o no existen).</p>
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
          <label htmlFor="generated-script" className={labelClasses}>
            Script Generado
          </label>
          <textarea
            id="generated-script"
            rows={16}
            value={generatedScript}
            readOnly
            className="font-mono p-4 rounded-md w-full h-96 block bg-gray-900 text-green-400 border border-gray-700 shadow-sm sm:text-sm"
            placeholder="-- El SQL generado aparecerá aquí..."
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {showLoopToggle && (
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={useLoopMode}
              onChange={(e) => setUseLoopMode(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
            />
            Usar modo bucle (cursor)
          </label>
        )}
        <button 
            onClick={copyToClipboard}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
            <Clipboard size={16} />
            Copy to Clipboard
        </button>
        <button
            onClick={handleGenerate}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-200 bg-white dark:bg-gray-700 border border-indigo-200 dark:border-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <Play size={16} />
            Actualizar ahora
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Historial reciente</p>
        <CompactLogList
          workspaceId={workspaceId}
          onRestore={restoreStateFromLog}
          onDelete={handleDeleteLog}
          reloadSignal={logReloadKey}
        />
      </div>

      {/* Modal para LabelViewer */}
      <Modal
        isOpen={showLabelViewerModal}
        onClose={() => setShowLabelViewerModal(false)}
        title="Importar Códigos de Barra"
        size="large" // Asegura que el modal sea grande para el LabelViewer
      >
        <LabelViewer onInjectCodes={handleInjectCodes} onClose={() => setShowLabelViewerModal(false)} />
      </Modal>
    </div>
  );
};
