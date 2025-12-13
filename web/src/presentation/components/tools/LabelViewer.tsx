"use client";

import React, { useCallback, useState } from 'react';
import { useLabelViewerFiles } from '@/presentation/hooks/useLabelViewerFiles';
import { DropOverlay } from './DropOverlay';
import { Toolbar } from './Toolbar';
import { CodeCard } from './CodeCard';
import { EmptyState } from './EmptyState';
import { Toast } from '../../utils/Toast'; // Importar Toast

interface LabelViewerProps {
  onInjectCodes?: (codes: string[]) => void;
  onClose?: () => void;
}

export const LabelViewer: React.FC<LabelViewerProps> = ({ onInjectCodes, onClose }) => {
  const {
    files,
    selectedFiles,
    isLoading,
    filters,
    loadFiles,
    clearGallery,
    toggleSelection,
    toggleFilter,
  } = useLabelViewerFiles();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFiles(e.dataTransfer.files, 'add');
      e.dataTransfer.clearData();
    } else {
      Toast.error('No se pudieron obtener los archivos del evento drop.');
    }
  }, [loadFiles]);

  // Aplica filtros CSS
  const getFilterStyle = useCallback(() => {
    const cssFilters: string[] = [];
    if (filters.contrast) cssFilters.push('contrast(150%)');
    if (filters.invert) cssFilters.push('invert(100%)');
    if (filters.grayscale) cssFilters.push('grayscale(100%)');
    return { filter: cssFilters.join(' ') };
  }, [filters]);

  return (
    <div
      className="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && <DropOverlay />}

      <Toolbar
        loadFiles={loadFiles}
        clearGallery={clearGallery}
        filters={filters}
        toggleFilter={toggleFilter}
        onInjectCodes={onInjectCodes} // Pasar para que Toolbar pueda manejar el botón "Generar SQL" / "Usar Códigos"
        selectedFileCount={selectedFiles.size}
      />

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Cargando archivos...</p>}

        {!isLoading && files.length === 0 && <EmptyState />}

        {!isLoading && files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <CodeCard
                key={file.name}
                file={file}
                selected={selectedFiles.has(file.name)}
                toggleSelection={toggleSelection}
                filterStyle={getFilterStyle()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
