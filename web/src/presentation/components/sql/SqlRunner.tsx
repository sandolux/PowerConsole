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
      setExecutionResult({ success: false, message: "No hay perfil de conexion seleccionado.", data: null });
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const response = await sqlExecutionService.executeScript(scriptToExecute, profileId);
      setExecutionResult(response);
    } catch (error) {
      setExecutionResult({
        success: false,
        message: `Error inesperado durante la ejecucion: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null,
      });
      console.error("Error during script execution:", error);
    } finally {
      setIsExecuting(false);
    }
  }, [scriptToExecute, profileId, sqlExecutionService]);

  return (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={null} // Set title to null to not display generic title
            size="5xl"
            panelClassName="h-[90vh] bg-gray-950 border border-gray-700 rounded-xl shadow-2xl flex flex-col p-0"
            bodyClassName="mt-0 flex flex-col flex-1"
            showHeader={false} // Disable the generic header
          >      {/* Window Header */}
      <div className="flex justify-between items-center p-3 px-5 bg-black border-b border-gray-700 text-white">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {isExecuting ? (
            <span className="inline-flex items-center rounded-full bg-gray-800 border border-gray-700 px-2 py-1 text-xs font-medium text-blue-400 gap-1">
              <span className="block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Ejecutando...
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-800 border border-gray-700 px-2 py-1 text-xs font-medium text-green-400 gap-1">
              <span className="block w-2 h-2 rounded-full bg-green-500"></span>
              Listo
            </span>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>

      {/* Main Split View Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: SQL Editor */}
        <div className="flex flex-col flex-1 border-r border-gray-700 bg-gray-900">
          <div className="p-2 px-4 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-semibold uppercase flex justify-between items-center">
            <span>SQL Editor</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-green-500 hover:bg-green-900/50 border border-green-500 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExecuteQuery}
              disabled={isExecuting}
            >
              <Play size={14} />
              RUN
            </button>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent border-none text-white p-4 font-mono text-sm resize-none outline-none"
            value={scriptToExecute}
            onChange={(e) => setScriptToExecute(e.target.value)}
            placeholder="Edita tu script SQL aquí..."
          />
        </div>

        {/* Right Panel: Console Output */}
        <div className="flex flex-col flex-1 bg-black">
          <div className="p-2 px-4 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-semibold uppercase">
            Console Output
          </div>
          <TerminalOutput response={executionResult} isExecuting={isExecuting} />
        </div>
      </div>
    </Modal>
  );
};
