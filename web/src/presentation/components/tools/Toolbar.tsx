"use client";

import React, { useCallback } from 'react';
import { Plus, X, GalleryHorizontal, Filter, Palette, Sun, Moon, Contrast, Pipette, ScanSearch, CheckSquare, Square } from 'lucide-react'; // Añadir CheckSquare, Square
import { Filters } from '@/presentation/hooks/useLabelViewerFiles'; // Ajusta la ruta si es necesario

interface ToolbarProps {
  loadFiles: (fileList: FileList, action: 'add' | 'replace') => Promise<void>;
  clearGallery: () => void;
  filters: Filters;
  toggleFilter: (filterName: 'contrast' | 'invert' | 'grayscale') => void;
  onInjectCodes?: () => void; // onInjectCodes ya no recibe un array, se llama directamente
  selectedFileCount: number;
  totalFileCount: number; // Añadir totalFileCount para saber si todos están seleccionados
  toggleSelectAll: () => void; // Añadir toggleSelectAll
}

export const Toolbar: React.FC<ToolbarProps> = ({
  loadFiles,
  clearGallery,
  filters,
  toggleFilter,
  onInjectCodes,
  selectedFileCount,
  totalFileCount,
  toggleSelectAll,
  context = 'standalone',
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFiles(e.target.files, 'add');
      e.target.value = ''; // Reset input
    }
  }, [loadFiles]);

  const allSelected = totalFileCount > 0 && selectedFileCount === totalFileCount;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
      {/* Sección de Carga de Archivos y Limpiar */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          multiple
          accept="image/*,.zip"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          title="Cargar imágenes o archivos ZIP"
        >
          <Plus className="w-4 h-4 mr-2" /> Cargar Archivos
        </label>
        <button
          onClick={clearGallery}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:text-white dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          title="Limpiar toda la galería"
        >
          <X className="w-4 h-4 mr-2" /> Limpiar Todo
        </button>
        {totalFileCount > 0 && (
          <button
            onClick={toggleSelectAll}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            title={allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
          >
            {allSelected ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
            {allSelected ? "Deseleccionar" : "Seleccionar Todos"}
          </button>
        )}
      </div>

      {/* Sección de Filtros */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">Filtros:</span>
        <button
          onClick={() => toggleFilter('contrast')}
          className={`inline-flex items-center justify-center p-2 rounded-md transition-colors
            ${filters.contrast ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Alternar Contraste"
        >
          <Contrast className="w-4 h-4" />
        </button>
        <button
          onClick={() => toggleFilter('invert')}
          className={`inline-flex items-center justify-center p-2 rounded-md transition-colors
            ${filters.invert ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Alternar Invertir Colores"
        >
          <Palette className="w-4 h-4" />
        </button>
        <button
          onClick={() => toggleFilter('grayscale')}
          className={`inline-flex items-center justify-center p-2 rounded-md transition-colors
            ${filters.grayscale ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Alternar Escala de Grises"
        >
          <Pipette className="w-4 h-4" />
        </button>
      </div>

      {/* Sección de Herramientas y Acción (Usar Códigos) */}
      <div className="flex items-center gap-2">
        {onInjectCodes && selectedFileCount > 0 && (
          <button
            onClick={onInjectCodes} // Llama directamente a onInjectCodes (ya preparada en LabelViewer)
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            title="Usar códigos de barra seleccionados"
          >
            <ScanSearch className="w-4 h-4 mr-2" /> Usar Códigos ({selectedFileCount})
          </button>
        )}
      </div>
    </div>
  );
};
