"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface SqlRunnerModalContextType {
  isSqlRunnerModalOpen: boolean;
  modalInitialScript: string;
  modalProfileId: string;
  openSqlRunnerModal: (script: string, profileId: string) => void;
  closeSqlRunnerModal: () => void;
}

const SqlRunnerModalContext = createContext<SqlRunnerModalContextType | undefined>(undefined);

export const SqlRunnerModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSqlRunnerModalOpen, setIsSqlRunnerModalOpen] = useState(false);
  const [modalInitialScript, setModalInitialScript] = useState('');
  const [modalProfileId, setModalProfileId] = useState('');

  const openSqlRunnerModal = useCallback((script: string, profileId: string) => {
    setModalInitialScript(script);
    setModalProfileId(profileId);
    setIsSqlRunnerModalOpen(true);
  }, []);

  const closeSqlRunnerModal = useCallback(() => {
    setIsSqlRunnerModalOpen(false);
    setModalInitialScript('');
    setModalProfileId('');
  }, []);

  return (
    <SqlRunnerModalContext.Provider
      value={{
        isSqlRunnerModalOpen,
        modalInitialScript,
        modalProfileId,
        openSqlRunnerModal,
        closeSqlRunnerModal,
      }}
    >
      {children}
    </SqlRunnerModalContext.Provider>
  );
};

export const useSqlRunnerModal = () => {
  const context = useContext(SqlRunnerModalContext);
  if (context === undefined) {
    throw new Error('useSqlRunnerModal must be used within a SqlRunnerModalProvider');
  }
  return context;
};
