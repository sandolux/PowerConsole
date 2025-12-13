import React from 'react';

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  return (
    // Main container with a light slate background for a soft, professional look
    <div className="min-h-screen w-full bg-slate-50 text-slate-800">
      {/* 
        A real dashboard might have a sidebar here. 
        For now, we focus on the main content area.
      */}
      
      {/* Main content area */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
            {title}
          </h1>
          
          {/* Child content will be rendered here */}
          <div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
