"use client";

import { useState, useMemo } from 'react';
import { useWorkspaces } from '../presentation/hooks/useWorkspaces';
import { Workspace, WorkspaceEnvironment } from '../core/domain/entities/Workspace';
import DashboardLayout from '../presentation/components/layout/DashboardLayout';
import { Plus, Search, FolderKanban, Trash2, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useBackup } from '@/presentation/hooks/useBackup';

// --- Sub-components for better structure ---

// Form for creating a new workspace
const CreateWorkspaceForm = ({ onSave, onCancel, isLoading }: { onSave: (name: string, description: string) => Promise<void>, onCancel: () => void, isLoading: boolean }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(name, description);
    setName('');
    setDescription('');
  };
  
  return (
    <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 mb-8">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Nuevo Workspace</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Workspace
          </button>
        </div>
      </form>
    </div>
  );
};

// Card representing a single workspace
const WorkspaceCard = ({ workspace, onDelete }: { workspace: Workspace, onDelete: (id: string) => void }) => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-5">
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{workspace.name}</h3>
      <p className="text-sm text-slate-500 mt-1 h-10">{workspace.description || 'Sin descripción.'}</p>
    </div>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs text-slate-400">Creado: {new Date(workspace.createdAt).toLocaleDateString()}</p>
      <button onClick={() => onDelete(workspace.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// Skeleton loader for the card
const WorkspaceCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 animate-pulse">
    <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
    <div className="h-4 w-full bg-slate-200 rounded mb-1"></div>
    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
      <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
      <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
    </div>
  </div>
);

// --- Main Page Component ---
export default function HomePage() {
  const { workspaces, loading, error, createWorkspace, deleteWorkspace } = useWorkspaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { handleImport } = useBackup();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCreateWorkspace = async (name: string, description: string) => {
    // For simplicity, add all environments by default
    const defaultEnvs: WorkspaceEnvironment[] = ['DEV', 'QA', 'PROD'];
    try {
      await createWorkspace(name, description, defaultEnvs);
      setShowCreateForm(false); // Hide form on success
    } catch (err) {
      console.error(err);
      // Here you could show a toast notification
    }
  };

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter(ws => ws.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [workspaces, searchQuery]);

  return (
    <DashboardLayout title="Mis Workspaces">
      {/* --- Internal Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-700">Proyectos Activos ({filteredWorkspaces.length})</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Plus size={16} />
              Nuevo
            </button>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              ref={fileInputRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  await handleImport(file);
                  // TODO: replace alert with toast
                  alert("Backup importado correctamente. Actualiza la lista si no se refleja automáticamente.");
                } catch (err) {
                  alert("Error al importar backup. Revisa la consola.");
                } finally {
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <Upload size={16} />
              Importar Backup
            </button>
          </div>
        </div>
      </div>

      {/* --- Conditional Create Form --- */}
      {showCreateForm && <CreateWorkspaceForm onSave={handleCreateWorkspace} onCancel={() => setShowCreateForm(false)} isLoading={loading} />}

      {/* --- Content Grid --- */}
      {error && <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">{error}</div>}
      
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <WorkspaceCardSkeleton key={i} />)
          ) : filteredWorkspaces.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-300 rounded-lg p-12">
              <FolderKanban size={48} className="text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No se encontraron workspaces</h3>
              <p className="text-slate-500 mt-1">{searchQuery ? 'Intenta con otra búsqueda.' : 'Crea tu primer workspace para comenzar.'}</p>
            </div>
          ) : (
            filteredWorkspaces.map(ws => (
              <Link key={ws.id} href={`/workspace/${ws.id}`} className="block">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{ws.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 h-10">{ws.description || 'Sin descripción.'}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Creado: {new Date(ws.createdAt).toLocaleDateString()}</p>
                    <button onClick={(e) => { e.preventDefault(); deleteWorkspace(ws.id); }} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
