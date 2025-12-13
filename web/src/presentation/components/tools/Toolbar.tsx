import React, { useCallback } from 'react';
import { Plus, X, GalleryHorizontal, Filter, Palette, Sun, Moon, Contrast, Pipette, ScanSearch, CheckSquare, Square, Upload, Trash2, Check as CheckIcon } from 'lucide-react';
import { Filters } from '@/presentation/hooks/useLabelViewerFiles';

interface ToolbarProps {
  loadFiles: (fileList: FileList, action: 'add' | 'replace') => Promise<void>;
  clearGallery: () => void;
  filters: Filters;
  toggleFilter: (filterName: 'contrast' | 'invert' | 'grayscale') => void;
  selectedFileCount: number; // Reintroducido
  totalFileCount: number;
  toggleSelectAll: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  loadFiles,
  clearGallery,
  filters,
  toggleFilter,
  selectedFileCount, // Reintroducido
  totalFileCount,
  toggleSelectAll,
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFiles(e.target.files, 'add');
      e.target.value = ''; // Reset input
    }
  }, [loadFiles]);

  const allSelected = totalFileCount > 0 && selectedFileCount === totalFileCount;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center gap-x-4">
      {/* GRUPO IZQUIERDO: ACCIONES (Carga y Limpieza) */}
      <div className="flex gap-2 items-center">
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
          className="inline-flex items-center p-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          title="Cargar imágenes o archivos ZIP"
        >
          <Upload className="w-4 h-4" /> {/* Icono de Cargar */}
        </label>
        <button
          onClick={clearGallery}
          className="inline-flex items-center p-1.5 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:text-white dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          title="Limpiar toda la galería"
        >
          <Trash2 className="w-4 h-4" /> {/* Icono de Limpiar */}
        </button>
        {totalFileCount > 0 && (
          <button
            onClick={toggleSelectAll}
            className="inline-flex items-center p-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            title={allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
          >
            {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} {/* Icono de Selección */}
          </button>
        )}
      </div>

      {/* GRUPO DERECHO: HERRAMIENTAS & FILTROS */}
      <div className="flex items-center gap-2"> {/* Cambiado gap-4 a gap-2 para los filtros */}
        {/* Contenedor de Filtros (Iconos) */}
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Filtros:</span>
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
      </div>
    </div>
  );
};
