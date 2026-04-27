"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, FC } from 'react';

interface UIContextProps {
  // Pane visibility
  showAgent: boolean;
  setShowAgent: (v: boolean) => void;
  showJson: boolean;
  setShowJson: (v: boolean) => void;
  showTrends: boolean;
  setShowTrends: (v: boolean) => void;
  showArch: boolean;
  setShowArch: (v: boolean) => void;

  // Cross-pane messaging
  injectedMessage: string | null;
  injectMessage: (msg: string) => void;
  consumeInjectedMessage: () => void;

  // Global settings
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [showAgent, setShowAgent] = useState(true);
  const [showJson, setShowJson] = useState(true);
  const [showTrends, setShowTrends] = useState(true);
  const [showArch, setShowArch] = useState(true);

  const [injectedMessage, setInjectedMessage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const injectMessage = useCallback((msg: string) => {
    setShowAgent(true);
    setInjectedMessage(msg);
  }, []);

  const consumeInjectedMessage = useCallback(() => {
    setInjectedMessage(null);
  }, []);

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
        injectedMessage,
        injectMessage,
        consumeInjectedMessage,
        showSettings,
        setShowSettings,
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
