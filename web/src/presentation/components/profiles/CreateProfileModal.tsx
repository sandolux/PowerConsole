"use client";

import { useState, useEffect } from "react";
import { useDi } from "@/presentation/context/DiContext";
import { CreateProfileUseCase } from "@/core/use-cases/profiles/CreateProfileUseCase";
import { UpdateProfileUseCase } from "@/core/use-cases/profiles/UpdateProfileUseCase";
import { Modal } from "../ui/Modal";
import { Profile } from "@/core/domain/entities/Profile";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess: () => void;
  profileToEdit?: Profile | null;
}

export const CreateProfileModal = ({
  isOpen,
  onClose,
  workspaceId,
  onSuccess,
  profileToEdit,
}: ProfileModalProps) => {
  const { profileRepo } = useDi();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<'sql' | 'rest'>("sql");
  const [host, setHost] = useState("");
  const [database, setDatabase] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!profileToEdit;

  useEffect(() => {
    if (isEditMode) {
      setName(profileToEdit.name);
      setType(profileToEdit.type);
      setHost(profileToEdit.host || "");
      setDatabase(profileToEdit.database || "");
      setUser(profileToEdit.user || "");
      setPassword(profileToEdit.password || ""); // Note: For real apps, handle passwords carefully
      setApiBaseUrl(profileToEdit.apiBaseUrl || "");
    } else {
      resetForm();
    }
  }, [profileToEdit, isEditMode, isOpen]);


  const resetForm = () => {
    setName("");
    setType("sql");
    setHost("");
    setDatabase("");
    setUser("");
    setPassword("");
    setApiBaseUrl("");
    setError(null);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        const updateProfile = new UpdateProfileUseCase(profileRepo);
        const updatedProfile: Profile = {
          ...profileToEdit,
          name,
          type,
          host: type === 'sql' ? host : undefined,
          database: type === 'sql' ? database : undefined,
          user: type === 'sql' ? user : undefined,
          password: type === 'sql' ? password : undefined,
          apiBaseUrl: type === 'rest' ? apiBaseUrl : undefined,
        };
        await updateProfile.execute(updatedProfile);
      } else {
        const createProfile = new CreateProfileUseCase(profileRepo);
        const profileData: Omit<Profile, 'id' | 'createdAt'> = {
          workspaceId,
          name,
          type,
          ...(type === 'sql' && { host, database, user, password }),
          ...(type === 'rest' && { apiBaseUrl }),
        };
        await createProfile.execute(profileData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Perfil" : "Crear Nuevo Perfil"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields remain the same */}
        <div className="mb-4">
          <label htmlFor="name" className={labelClasses}>
            Nombre del Perfil
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className={labelClasses}>
            Tipo de Perfil
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'sql' | 'rest')}
            className={inputClasses}
          >
            <option value="sql">SQL Server</option>
            <option value="rest">REST API</option>
          </select>
        </div>

        {type === 'sql' && (
          <>
            <div className="mb-4">
                <label htmlFor="host" className={labelClasses}>Host</label>
                <input type="text" id="host" placeholder="Host" onChange={e => setHost(e.target.value)} value={host} className={inputClasses}/>
            </div>
            <div className="mb-4">
                <label htmlFor="database" className={labelClasses}>Database</label>
                <input type="text" id="database" placeholder="Database" onChange={e => setDatabase(e.target.value)} value={database} className={inputClasses}/>
            </div>
            <div className="mb-4">
                <label htmlFor="user" className={labelClasses}>User</label>
                <input type="text" id="user" placeholder="User" onChange={e => setUser(e.target.value)} value={user} className={inputClasses}/>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className={labelClasses}>Password</label>
                <input type="password" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} className={inputClasses}/>
            </div>
          </>
        )}

        {type === 'rest' && (
          <>
            <div className="mb-4">
                <label htmlFor="apiBaseUrl" className={labelClasses}>API Base URL</label>
                <input type="text" id="apiBaseUrl" placeholder="API Base URL" onChange={e => setApiBaseUrl(e.target.value)} value={apiBaseUrl} className={inputClasses}/>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Crear Perfil")}
          </button>
        </div>
      </form>
    </Modal>
  );
};
