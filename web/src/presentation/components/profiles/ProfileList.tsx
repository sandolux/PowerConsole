"use client";

import { useState } from "react";
import { useProfiles } from "@/presentation/hooks/useProfiles";
import { Profile } from "@/core/domain/entities/Profile";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileModal } from "./CreateProfileModal";
import { Plus } from "lucide-react";

export const ProfileList = ({ workspaceId }: { workspaceId: string }) => {
  const { profiles, loading, error, reloadProfiles } = useProfiles(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);

  const handleCreate = () => {
    setProfileToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (profile: Profile) => {
    setProfileToEdit(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProfileToEdit(null); // Reset on close
  };

  if (loading) {
    return <p className="text-slate-500">Cargando perfiles...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      {profiles.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-700">
            No hay perfiles configurados
          </h3>
          <p className="text-slate-500 mt-1 mb-4">
            Crea tu primer perfil de conexión para empezar a trabajar.
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Crear Perfil
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Crear Perfil
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      )}

      <CreateProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        workspaceId={workspaceId}
        onSuccess={reloadProfiles}
        profileToEdit={profileToEdit}
      />
    </>
  );
};
