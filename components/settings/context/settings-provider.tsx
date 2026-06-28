'use client';

import type { ReactNode } from 'react';

import { isEqual } from 'es-toolkit';
import { getCookie, getStorage } from 'minimal-shared/utils';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useCookies, useLocalStorage } from 'minimal-shared/hooks';

import type { SettingsState } from './settings-context';

import { SettingsContext } from './settings-context';
import { SETTINGS_STORAGE_KEY } from '../settings-config';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  defaultSettings: SettingsState;
  cookieSettings?: SettingsState;
  storageKey?: string;
};

export function SettingsProvider({
  children,
  cookieSettings,
  defaultSettings,
  storageKey = SETTINGS_STORAGE_KEY,
}: Props) {
  const isCookieEnabled = !!cookieSettings;
  const useStorage = isCookieEnabled ? useCookies : useLocalStorage;
  const initialSettings = isCookieEnabled ? cookieSettings : defaultSettings;
  const getStorageValue = isCookieEnabled ? getCookie : getStorage;

  const { state, setState, resetState, setField } = useStorage<SettingsState>(
    storageKey,
    initialSettings as SettingsState
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => setOpenDrawer((prev) => !prev), []);
  const onCloseDrawer = useCallback(() => setOpenDrawer(false), []);

  const canReset = !isEqual(state, defaultSettings);

  const onReset = useCallback(() => {
    resetState(defaultSettings);
  }, [defaultSettings, resetState]);

  // Reset stored settings when version changes
  useEffect(() => {
    const storedValue = getStorageValue(storageKey);
    if (storedValue) {
      try {
        const stored = storedValue as Partial<SettingsState>;
        if (!stored.version || stored.version !== defaultSettings.version) {
          onReset();
        }
      } catch {
        onReset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedValue = useMemo(
    () => ({
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setState,
      setField,
    }),
    [canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer, state, setField, setState]
  );

  return <SettingsContext value={memoizedValue}>{children}</SettingsContext>;
}
