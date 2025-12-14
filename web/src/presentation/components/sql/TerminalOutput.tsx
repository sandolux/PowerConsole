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
    const columnWidths = headers.map((header) =>
      Math.max(header.length, ...data.map((row) => String(row[header]).length))
    );

    const headerRow = headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ');
    const separator = columnWidths.map((width) => '-'.repeat(width)).join(' + ');

    const dataRows = data
      .map((row) =>
        headers.map((header, i) => String(row[header]).padEnd(columnWidths[i])).join(' | ')
      )
      .join('\n');

    return `${headerRow}\n${separator}\n${dataRows}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 text-white px-4 py-2 text-xs rounded-t-lg">PowerConsole CLI - Ejecución</div>
      <div className="bg-black text-green-400 font-mono p-4 rounded-b-lg overflow-auto flex-1 text-sm whitespace-pre-wrap">
        {isExecuting && <div className="text-blue-400">[INFO] Ejecutando consulta... {spinner}</div>}

        {response && !isExecuting && (
          <>
            {response.success ? (
              <div className="text-green-400">
                [SUCCESS] Ejecución finalizada.
                {response.message && <div>{response.message}</div>}
                {response.data && response.data.length > 0 && (
                  <pre className="mt-2">{formatTable(response.data)}</pre>
                )}
                {(!response.data || response.data.length === 0) && (
                  <div className="mt-2 text-blue-400">[INFO] No se devolvieron datos.</div>
                )}
              </div>
            ) : (
              <div className="text-red-400">
                [ERROR] Consulta fallida.
                {response.message && <div>{response.message}</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};