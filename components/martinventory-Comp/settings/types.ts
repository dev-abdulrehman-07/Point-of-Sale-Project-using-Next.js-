import { DEFAULT_SETTINGS } from "./constants";

export type SettingsState = typeof DEFAULT_SETTINGS;

export type ToastType = "success" | "error";

export interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}
