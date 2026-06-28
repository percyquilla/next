'use client';

import { use } from 'react';

import type { SettingsContextValue } from './settings-context';

import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function useSettingsContext(): SettingsContextValue {
  const context = use(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be used inside SettingsProvider');

  return context;
}
