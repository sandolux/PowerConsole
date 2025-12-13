"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

// Main container component
export const Tabs = ({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

// Hook to access context
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a <Tabs> component.");
  }
  return context;
};

// Component for the list of trigger buttons
export const TabsList = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
};

// Component for an individual tab button
export const TabsTrigger = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none ${
        isActive
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
};

// Component for the content of a tab
export const TabsContent = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  return isActive ? <div className="py-6">{children}</div> : null;
};
