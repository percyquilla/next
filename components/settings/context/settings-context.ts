'use client';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export type SettingsState = {
  mode: string;
  direction: string;
  contrast: string;
  navLayout: string;
  primaryColor: string;
  navColor: string;
  compactLayout: boolean;
  fontSize: number;
  fontFamily: string;
  version: string;
};

export type SettingsContextValue = {
  state: SettingsState;
  canReset: boolean;
  openDrawer: boolean;
  setState: (newState: Partial<SettingsState>) => void;
  setField: (key: keyof SettingsState, value: SettingsState[keyof SettingsState]) => void;
  onReset: () => void;
  onToggleDrawer: () => void;
  onCloseDrawer: () => void;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);
