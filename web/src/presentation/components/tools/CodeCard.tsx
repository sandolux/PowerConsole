"use client";

import React from 'react';

interface CodeCardProps {
  file: { name: string; url: string };
  selected: boolean;
  toggleSelection: (fileName: string) => void;
  filterStyle: React.CSSProperties;
}

export const CodeCard: React.FC<CodeCardProps> = ({ file, selected, toggleSelection, filterStyle }) => {
  return (
    <div
      className={`relative border rounded-md overflow-hidden cursor-pointer transition-all duration-200
                  ${selected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
      onClick={() => toggleSelection(file.name)}
    >
      <img
        src={file.url}
        alt={file.name}
        className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-800"
        style={filterStyle}
      />
      <div className="p-2 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
        <p className="truncate mr-2">{file.name}</p>
        <input
          type="checkbox"
          checked={selected}
          readOnly // Para evitar la manipulación directa por el input
          className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
