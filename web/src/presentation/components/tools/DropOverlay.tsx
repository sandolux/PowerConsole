"use client";

import React from 'react';

export const DropOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-indigo-600 bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
      <p className="text-white text-2xl font-semibold">Suelta tus archivos aquí</p>
    </div>
  );
};
