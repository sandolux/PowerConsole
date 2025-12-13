"use client";

import { useState, useMemo } from 'react';
import { useWorkspaces } from '../presentation/hooks/useWorkspaces';
import { Workspace, WorkspaceEnvironment } from '../core/domain/entities/Workspace';
import { AppLayout } from '../presentation/components/layout/AppLayout';
import { Plus, Search, FolderKanban, Trash2, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useBackup } from '@/presentation/hooks/useBackup';
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle';

// --- Sub-components for better structure ---

// Form for creating a new workspace
const CreateWorkspaceForm = ({ onSave, onCancel, isLoading }: { onSave: (name: string, description: string, color?: string) => Promise<void>, onCancel: () => void, isLoading: boolean }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string | undefined>();
  const palette = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(name, description, color);
    setName('');
    setDescription('');
    setColor(undefined);
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
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Color de Identificación</p>
          <div className="flex flex-wrap gap-2">
            {palette.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition ${color === c ? 'border-slate-900 ring-2 ring-slate-300' : 'border-transparent'} ${c}`}
                aria-label={`Seleccionar color ${c}`}
              />
            ))}
          </div>
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
const WorkspaceCard = ({ workspace, onDelete }: { workspace: Workspace, onDelete: (id: string) => void }) => {
  const colorClass = workspace.color || 'bg-slate-300';
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative`}>
      <div className={`w-1 h-full absolute left-0 top-0 ${colorClass}`} />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{workspace.name}</h3>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(workspace.id); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-gray-800 rounded-full transition"
            aria-label="Eliminar workspace"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {workspace.description || 'Sin descripción.'}
        </p>
        <div className="flex justify-between items-center mt-auto pt-3 text-xs text-slate-400 dark:text-slate-500">
          <span>Modificado: {new Date(workspace.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

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
  const { workspaces, loading, error, createWorkspace, deleteWorkspace, loadWorkspaces } = useWorkspaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { handleImport } = useBackup();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCreateWorkspace = async (name: string, description: string, color?: string) => {
    // For simplicity, add all environments by default
    const defaultEnvs: WorkspaceEnvironment[] = ['DEV', 'QA', 'PROD'];
    try {
      await createWorkspace(name, description, defaultEnvs, color);
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
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mis Workspaces</h1>
        <div className="flex items-center gap-2">
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
                alert("Backup importado correctamente. Actualiza la lista si no se refleja automáticamente.");
                await loadWorkspaces();
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <Upload size={16} />
            Importar
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <Plus size={16} />
            Nuevo Workspace
          </button>
        </div>
      </div>

      {/* --- Conditional Create Form --- */}
      {showCreateForm && <CreateWorkspaceForm onSave={handleCreateWorkspace} onCancel={() => setShowCreateForm(false)} isLoading={loading} />}

      {/* --- Content Grid --- */}
      {error && <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">{error}</div>}
      
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 items-start">
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
                <WorkspaceCard workspace={ws} onDelete={deleteWorkspace} />
              </Link>
            ))
          )}
        </div>
      )}
    </AppLayout>
  );
}
