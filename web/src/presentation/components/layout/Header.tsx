import { Search, Bell, HelpCircle } from 'lucide-react';

export function Header({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-8 flex items-center justify-between">
      {/* Breadcrumbs / Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar (Ctrl+K)..." 
            className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-64 outline-none"
          />
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}