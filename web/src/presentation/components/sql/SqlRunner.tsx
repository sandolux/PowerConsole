import React, { useMemo, useState, useCallback } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';
import { TerminalOutput } from './TerminalOutput';
import { SqlExecutionService, ExecutionResponse } from '@/core/services/SqlExecutionService';
import { Play } from 'lucide-react';

interface SqlRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialScript: string;
  profileId: string;
}

export const SqlRunner: React.FC<SqlRunnerProps> = ({ isOpen, onClose, title, initialScript, profileId }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResponse | null>(null);
  const [scriptToExecute, setScriptToExecute] = useState(initialScript);
  const sqlExecutionService = useMemo(() => new SqlExecutionService(), []);
  const handleExecuteQuery = useCallback(async () => {
    if (!scriptToExecute) {
      setExecutionResult({ success: false, message: "No hay script para ejecutar.", data: null });
      return;
    }
    if (!profileId) {
      setExecutionResult({ success: false, message: "No hay perfil de conexión seleccionado.", data: null });
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null); // Clear previous results

    try {
      const response = await sqlExecutionService.executeScript(scriptToExecute, profileId);
      setExecutionResult(response);
    } catch (error) {
      setExecutionResult({
        success: false,
        message: `Error inesperado durante la ejecución: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null,
      });
      console.error("Error during script execution:", error);
    } finally {
      setIsExecuting(false);
    }
  }, [scriptToExecute, profileId, sqlExecutionService]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="5xl" panelClassName="p-0" bodyClassName="mt-0 flex flex-col flex-1">
      <div className="grid grid-cols-2 gap-4 h-full flex-1">
        {/* Left Column: Terminal Output */}
        <div className="flex flex-col h-full">
          <TerminalOutput response={executionResult} isExecuting={isExecuting} />
        </div>

        {/* Right Column: Script Editor and Execute Button */}
        <div className="flex flex-col h-full">
          <textarea
            className="flex-1 font-mono p-4 rounded-md w-full bg-gray-800 text-gray-100 border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
            value={scriptToExecute}
            onChange={(e) => setScriptToExecute(e.target.value)}
            placeholder="Edita tu script SQL aquí..."
          />
          <button
            type="button"
            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExecuteQuery}
            disabled={isExecuting}
          >
            <Play size={16} className="mr-2" />
            Ejecutar consulta
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-end px-6 pb-6">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={onClose}
          disabled={isExecuting}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};