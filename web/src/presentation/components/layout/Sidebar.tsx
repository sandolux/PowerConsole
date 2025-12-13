import Link from 'next/link';
import { 
  LayoutGrid, 
  Settings, 
  Box, 
  Terminal, 
  FileCode, 
  History,
  Database
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white font-bold text-lg tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal size={18} className="text-white" />
          </div>
          PowerConsole
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        
        {/* Section: General */}
        <div>
          <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Plataforma
          </h3>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium">
                <LayoutGrid size={18} />
                Workspaces
              </Link>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors">
                <Settings size={18} />
                Configuración Global
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Context (Simulado por ahora, se activará al entrar a un workspace) */}
        <div>
          <h3 className="px-2 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
            Workspace Activo
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
          </h3>
          <div className="px-3 py-4 border border-dashed border-slate-800 rounded-lg text-center">
            <p className="text-xs text-slate-500">Selecciona un proyecto</p>
          </div>
          {/* Aquí inyectaremos dinámicamente:
            - <Database /> Perfiles
            - <FileCode /> Templates
            - <Box /> Runners
            - <History /> Historial
          */}
        </div>
      </nav>

      {/* Footer User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Developer</p>
            <p className="text-xs text-slate-500 truncate">Admin Mode</p>
          </div>
        </div>
      </div>
    </aside>
  );
}