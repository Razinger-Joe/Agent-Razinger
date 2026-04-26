"use client";

import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface UIContextProps {
  showAgent: boolean;
  setShowAgent: (v: boolean) => void;
  showJson: boolean;
  setShowJson: (v: boolean) => void;
  showTrends: boolean;
  setShowTrends: (v: boolean) => void;
  showArch: boolean;
  setShowArch: (v: boolean) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [showAgent, setShowAgent] = useState(true);
  const [showJson, setShowJson] = useState(true);
  const [showTrends, setShowTrends] = useState(true);
  const [showArch, setShowArch] = useState(true);

  return (
    <UIContext.Provider
      value={{
        showAgent,
        setShowAgent,
        showJson,
        setShowJson,
        showTrends,
        setShowTrends,
        showArch,
        setShowArch,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIContext must be used within UIContextProvider');
  return ctx;
};
