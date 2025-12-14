import React, { useEffect, useState } from 'react';
import { ExecutionResponse } from '@/core/services/SqlExecutionService';

interface TerminalOutputProps {
  response: ExecutionResponse | null;
  isExecuting: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ response, isExecuting }) => {
  const [spinner, setSpinner] = useState<string>('|');
  const spinnerChars = ['|', '/', '-', '\\'];

  useEffect(() => {
    if (isExecuting) {
      const interval = setInterval(() => {
        setSpinner((prev) => {
          const currentIndex = spinnerChars.indexOf(prev);
          return spinnerChars[(currentIndex + 1) % spinnerChars.length];
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isExecuting]);

  const formatTable = (data: any[]): string => {
    if (!data || data.length === 0) {
      return '[INFO] No hay datos para mostrar.';
    }

    const headers = Object.keys(data[0]);
    const columnWidths = headers.map((header) => Math.max(header.length, ...data.map((row) => String(row[header]).length)));

    const headerRow = headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ');
    const separator = columnWidths.map((width) => '-'.repeat(width)).join(' + ');

    const dataRows = data
      .map((row) => headers.map((header, i) => String(row[header]).padEnd(columnWidths[i])).join(' | '))
      .join('\n');

    return `${headerRow}\n${separator}\n${dataRows}`;
  };

  return (
    <div className="flex-1 p-4 font-mono text-xs text-gray-300 overflow-y-auto whitespace-pre-wrap">
      {isExecuting && (
        <div className="text-blue-400">
          <span className="text-gray-500">[INFO]</span> Ejecutando consulta... {spinner}
        </div>
      )}

      {response && !isExecuting && (
        <>
          {response.success ? (
            <div className="text-green-500">
              <span className="text-gray-500">[SUCCESS]</span> Ejecucion finalizada.
              {response.message && <div className="text-gray-300">{response.message}</div>}
              {response.data && response.data.length > 0 && (
                <pre className="mt-2 text-gray-300">{formatTable(response.data)}</pre>
              )}
              {(!response.data || response.data.length === 0) && (
                <div className="mt-2 text-blue-400">
                  <span className="text-gray-500">[INFO]</span> No se devolvieron datos.
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-400">
              <span className="text-gray-500">[ERROR]</span> Consulta fallida.
              {response.message && <div className="text-gray-300">{response.message}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};
