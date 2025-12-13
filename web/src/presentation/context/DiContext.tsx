"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// 1. Import Interfaces (Ports from Core)
import { IWorkspaceRepository } from '../../core/repositories/IWorkspaceRepository';
import { IProfileRepository } from '../../core/repositories/IProfileRepository';
import { ITemplateRepository } from '../../core/repositories/ITemplateRepository';
import { ICryptoService } from '../../core/repositories/ICryptoService';

// 2. Import Implementations (Adapters from Infrastructure)
import { DexieWorkspaceRepository } from '../../infrastructure/repositories/DexieWorkspaceRepository';
import { DexieProfileRepository } from '../../infrastructure/repositories/DexieProfileRepository';
import { DexieTemplateRepository } from '../../infrastructure/repositories/DexieTemplateRepository';
import { SimpleCryptoService } from '../../infrastructure/repositories/SimpleCryptoService';

// 3. Define the shape of the dependencies object
export interface AppDependencies {
  workspaceRepo: IWorkspaceRepository;
  profileRepo: IProfileRepository;
  templateRepo: ITemplateRepository;
  cryptoService: ICryptoService;
}

// 4. Instantiate concrete implementations to be injected
const appDependencies: AppDependencies = {
  workspaceRepo: new DexieWorkspaceRepository(),
  profileRepo: new DexieProfileRepository(),
  templateRepo: new DexieTemplateRepository(),
  cryptoService: new SimpleCryptoService(),
};

// 5. Create the React Context
// We initialize it with null, but the provider will supply the actual value.
const DiContext = createContext<AppDependencies | null>(null);

// 6. Create the Provider Component
interface DiProviderProps {
  children: ReactNode;
}

export const DiProvider: React.FC<DiProviderProps> = ({ children }) => {
  return (
    <DiContext.Provider value={appDependencies}>
      {children}
    </DiContext.Provider>
  );
};

// 7. Create the custom hook for consuming dependencies
export const useDi = (): AppDependencies => {
  const context = useContext(DiContext);
  if (!context) {
    // This error ensures the hook is used within a component wrapped by DiProvider
    throw new Error('useDi must be used within a DiProvider');
  }
  return context;
};
