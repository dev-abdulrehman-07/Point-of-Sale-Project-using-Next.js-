"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY, THEME_STORAGE_KEY } from "../constants";
import type { SettingsState, ToastState } from "../types";

interface SettingsContextValue {
  settings: SettingsState;
  updateSettings: (patch: Partial<SettingsState>) => void;
  isDark: boolean;
  setDarkMode: (enabled: boolean) => void;
  showToast: (type: ToastState["type"], message: string) => void;
  toasts: ToastState[];
  dismissToast: (id: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStoredSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function readStoredTheme(): boolean {
  if (typeof window === "undefined") return false;

  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return readStoredSettings().darkMode;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isDark, setIsDark] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedSettings = readStoredSettings();
    const storedDark = readStoredTheme();
    setSettings({ ...storedSettings, darkMode: storedDark });
    setIsDark(storedDark);
    setHydrated(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<SettingsState>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setDarkMode = useCallback(
    (enabled: boolean) => {
      setIsDark(enabled);
      localStorage.setItem(THEME_STORAGE_KEY, enabled ? "dark" : "light");
      updateSettings({ darkMode: enabled });
    },
    [updateSettings],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastState["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      isDark,
      setDarkMode,
      showToast,
      toasts,
      dismissToast,
    }),
    [settings, updateSettings, isDark, setDarkMode, showToast, toasts, dismissToast],
  );

  return (
    <SettingsContext.Provider value={value}>
      <div
        className={
          isDark && hydrated
            ? "dark w-full rounded-2xl bg-zinc-950 text-zinc-100"
            : "w-full"
        }
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
