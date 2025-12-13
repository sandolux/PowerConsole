"use client";

import React from 'react';
import { ImagePlus } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500 dark:text-gray-400">
      <ImagePlus className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600" />
      <p className="text-lg font-semibold mb-2">No hay archivos cargados</p>
      <p className="max-w-md">
        Arrastra y suelta imágenes o archivos ZIP aquí, o haz clic en "Cargar Archivos" para empezar.
        Se admiten formatos JPG, PNG, GIF, BMP, WEBP.
      </p>
    </div>
  );
};
