"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDi } from "@/presentation/context/DiContext";
import { CreateProfileUseCase } from "@/core/use-cases/profiles/CreateProfileUseCase";
import { UpdateProfileUseCase } from "@/core/use-cases/profiles/UpdateProfileUseCase";
import { Modal } from "../ui/Modal";
import { Profile } from "@/core/domain/entities/Profile";
import { useVariables } from "@/presentation/hooks/useVariables";

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
  const { profileRepo, variableResolver } = useDi();
  const { variables } = useVariables(workspaceId);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<'sql' | 'rest'>("sql");
  const [host, setHost] = useState("");
  const [database, setDatabase] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

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

  const inputClasses = "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 transition-colors focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const variableMap = useMemo(
    () =>
      variables.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>),
    [variables]
  );

  const resolvedHost = variableResolver.resolve(host || "", variableMap);
  const resolvedDatabase = variableResolver.resolve(database || "", variableMap);
  const resolvedApiBaseUrl = variableResolver.resolve(apiBaseUrl || "", variableMap);

  const autocompleteVariables = variables.map(v => v.key);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Perfil" : "Crear Nuevo Perfil"}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 relative">
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
            <CodeEditor
              label="Host"
              value={host}
              onChange={setHost}
              placeholder="Host"
              variables={autocompleteVariables}
              resolved={resolvedHost}
            />
            <CodeEditor
              label="Database"
              value={database}
              onChange={setDatabase}
              placeholder="Database"
              variables={autocompleteVariables}
              resolved={resolvedDatabase}
            />
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
            <CodeEditor
              label="API Base URL"
              value={apiBaseUrl}
              onChange={setApiBaseUrl}
              placeholder="API Base URL"
              variables={autocompleteVariables}
              resolved={resolvedApiBaseUrl}
            />
            </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
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

interface CodeEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variables: string[];
  resolved?: string;
}

const CodeEditor = ({ label, value, onChange, placeholder, variables, resolved }: CodeEditorProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const filtered = variables.filter((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    const cursor = e.target.selectionStart ?? val.length;
    const uptoCursor = val.slice(0, cursor);
    const lastOpen = uptoCursor.lastIndexOf("{{");
    const lastClose = uptoCursor.lastIndexOf("}}");
    if (lastOpen !== -1 && lastOpen > lastClose) {
      const term = uptoCursor.slice(lastOpen + 2);
      setIsMenuOpen(true);
      setSearchTerm(term.trim());
    } else {
      setIsMenuOpen(false);
      setSearchTerm("");
    }
  };

  const handleSelect = (key: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const cursor = el.selectionStart ?? value.length;
    const uptoCursor = value.slice(0, cursor);
    const lastOpen = uptoCursor.lastIndexOf("{{");
    if (lastOpen === -1) return;
    const before = value.slice(0, lastOpen + 2);
    const after = value.slice(cursor);
    const newVal = `${before}${key}}}${after}`;
    onChange(newVal);
    setIsMenuOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="mb-4 space-y-1 relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 transition-colors font-mono min-h-[80px]"
      />
      {resolved !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400">Resuelto: {resolved || "—"}</p>
      )}
      {isMenuOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-auto">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">Sin coincidencias</div>
          )}
          {filtered.map((k) => (
            <button
              key={k}
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => handleSelect(k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
