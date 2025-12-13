"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// 1. Import Interfaces (Ports from Core)
import { IWorkspaceRepository } from '../../core/repositories/IWorkspaceRepository';
import { IProfileRepository } from '../../core/repositories/IProfileRepository';
import { IScriptTemplateRepository } from '../../core/repositories/IScriptTemplateRepository';
import { IVariableRepository } from '../../core/repositories/IVariableRepository';
import { IScriptGenerator } from '@/core/domain/services/IScriptGenerator';
import { SqlParserService } from '@/core/services/SqlParserService';
import { ICryptoService } from '../../core/repositories/ICryptoService';
import { IExecutionLogRepository } from '../../core/repositories/IExecutionLogRepository';
import { DeleteLogUseCase } from '@/core/use-cases/logs/DeleteLogUseCase';

// 2. Import Implementations (Adapters from Infrastructure)
import { DexieWorkspaceRepository } from '../../infrastructure/repositories/DexieWorkspaceRepository';
import { DexieProfileRepository } from '../../infrastructure/repositories/DexieProfileRepository';
import { DexieScriptTemplateRepository } from '../../infrastructure/repositories/DexieScriptTemplateRepository';
import { DexieVariableRepository } from '../../infrastructure/repositories/DexieVariableRepository';
import { SimpleCryptoService } from '../../infrastructure/repositories/SimpleCryptoService';
import { SqlScriptGeneratorService } from '@/core/services/SqlScriptGeneratorService';
import { DexieExecutionLogRepository } from '../../infrastructure/repositories/DexieExecutionLogRepository';
import { BackupService } from '@/core/services/BackupService';
import { ExportWorkspaceUseCase } from '@/core/use-cases/backup/ExportWorkspaceUseCase';
import { ImportWorkspaceUseCase } from '@/core/use-cases/backup/ImportWorkspaceUseCase';

// 3. Define the shape of the dependencies object
export interface AppDependencies {
  workspaceRepo: IWorkspaceRepository;
  profileRepo: IProfileRepository;
  templateRepo: IScriptTemplateRepository;
  variableRepo: IVariableRepository;
  cryptoService: ICryptoService;
  scriptGenerator: IScriptGenerator;
  sqlParser: SqlParserService;
  executionLogRepo: IExecutionLogRepository;
  deleteLogUseCase: DeleteLogUseCase;
  backupService: BackupService;
  exportWorkspaceUseCase: ExportWorkspaceUseCase;
  importWorkspaceUseCase: ImportWorkspaceUseCase;
}

// 4. Instantiate concrete implementations to be injected
const executionLogRepoInstance = new DexieExecutionLogRepository();
const workspaceRepoInstance = new DexieWorkspaceRepository();
const profileRepoInstance = new DexieProfileRepository();
const templateRepoInstance = new DexieScriptTemplateRepository();
const variableRepoInstance = new DexieVariableRepository();
const backupServiceInstance = new BackupService(
  workspaceRepoInstance,
  profileRepoInstance,
  variableRepoInstance,
  templateRepoInstance,
  executionLogRepoInstance
);

const appDependencies: AppDependencies = {
  workspaceRepo: workspaceRepoInstance,
  profileRepo: profileRepoInstance,
  templateRepo: templateRepoInstance,
  variableRepo: variableRepoInstance,
  cryptoService: new SimpleCryptoService(),
  scriptGenerator: new SqlScriptGeneratorService(),
  sqlParser: new SqlParserService(),
  executionLogRepo: executionLogRepoInstance,
  deleteLogUseCase: new DeleteLogUseCase(executionLogRepoInstance),
  backupService: backupServiceInstance,
  exportWorkspaceUseCase: new ExportWorkspaceUseCase(backupServiceInstance),
  importWorkspaceUseCase: new ImportWorkspaceUseCase(backupServiceInstance),
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
