import { useState, useCallback, useMemo } from 'react';
import { FileProcessorService } from '@/core/services/FileProcessorService'; // Asumiendo que esta es la ruta correcta

interface ProcessedFile {
  name: string;
  blob: Blob;
}

interface GalleryFile {
  name: string;
  url: string;
  blob: Blob;
  code: string; // Añadir la propiedad 'code'
}

export interface Filters {
  contrast: boolean;
  invert: boolean;
  grayscale: boolean;
}

export const useLabelViewerFiles = () => {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    contrast: false,
    invert: false,
    grayscale: false,
  });
  const fileProcessorService = useMemo(() => new FileProcessorService(), []);

  // Almacena los nombres de todos los archivos cargados para detectar duplicados
  const currentNameIndex = useMemo(() => new Set<string>(files.map(f => f.name)), [files]);

  const clearGallery = useCallback(() => {
    files.forEach(file => URL.revokeObjectURL(file.url));
    setFiles([]);
    setSelectedFiles(new Set());
  }, [files]); // Depende de 'files' para revocar las URLs

  const loadFiles = useCallback(async (fileList: FileList, action: 'add' | 'replace') => {
    setIsLoading(true);
    try {
      // Usamos currentNameIndex que se actualiza reactivamente
      const effectiveNameIndex = action === 'replace' ? new Set<string>() : new Set<string>(files.map(f => f.name));

      const { processedFiles, skippedCount } = await fileProcessorService.processFiles(fileList, effectiveNameIndex);

      if (action === 'replace') {
        clearGallery(); // Llamar directamente a la función si está definida arriba
      }

      const newGalleryFiles: GalleryFile[] = processedFiles.map(file => ({
        name: file.name,
        code: file.code, // Añadir el código saneado
        url: URL.createObjectURL(file.blob),
        blob: file.blob,
      }));


      setFiles(prevFiles => {
        const updatedFiles = action === 'replace' ? newGalleryFiles : [...prevFiles, ...newGalleryFiles];
        const uniqueFiles = Array.from(new Map(updatedFiles.map(file => [file.name, file])).values());
        return uniqueFiles.sort((a, b) => a.name.localeCompare(b.name));
      });

      if (skippedCount > 0) {
        // Aquí se podría mostrar un toast o notificación al usuario
        console.warn(`${skippedCount} files were skipped due to duplication or unsupported format.`);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      // Aquí se podría mostrar un toast de error
    } finally {
      setIsLoading(false);
    }
  }, [fileProcessorService, clearGallery, files]); // Añadir 'files' si se usa para effectiveNameIndex

  const toggleSelection = useCallback((fileName: string) => {
    setSelectedFiles(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(fileName)) {
        newSelection.delete(fileName);
      } else {
        newSelection.add(fileName);
      }
      return newSelection;
    });
  }, []);

  const toggleFilter = useCallback((filterName: 'contrast' | 'invert' | 'grayscale') => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedFiles(prevSelected => {
      if (prevSelected.size === files.length) {
        return new Set(); // Deseleccionar todo si todos están seleccionados
      } else {
        return new Set(files.map(file => file.name)); // Seleccionar todo
      }
    });
  }, [files]);

  const removeFile = useCallback((fileName: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(file => file.name === fileName);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url); // Liberar la URL
      }
      return prevFiles.filter(file => file.name !== fileName);
    });
    setSelectedFiles(prevSelected => {
      const newSelection = new Set(prevSelected);
      newSelection.delete(fileName);
      return newSelection;
    });
  }, []);

  return {
    files,
    selectedFiles,
    isLoading,
    filters,
    loadFiles,
    clearGallery,
    toggleSelection,
    toggleFilter,
    toggleSelectAll,
    removeFile, // Añadir removeFile
  };
};