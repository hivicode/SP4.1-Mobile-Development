import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_STORE_SETTINGS,
  getStoreSettings,
  saveStoreSettings,
} from '../storage/storage';
import { createThemedColors } from '../theme/design';

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_STORE_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await getStoreSettings();
      if (alive) {
        setSettings(saved);
        setReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const updateSettings = useCallback(async (patch) => {
    const next = await saveStoreSettings({
      ...settings,
      ...patch,
    });
    setSettings(next);
    return next;
  }, [settings]);

  const value = useMemo(
    () => ({
      ready,
      settings,
      appColors: createThemedColors(undefined, settings.appearanceMode),
      updateSettings,
    }),
    [ready, settings, updateSettings]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const value = useContext(AppSettingsContext);
  if (!value) {
    throw new Error('useAppSettings must be used inside AppSettingsProvider');
  }
  return value;
}
