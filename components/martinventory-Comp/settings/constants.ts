export const LIME = "#ccff66";

export const SETTINGS_STORAGE_KEY = "mart-inventory-settings";

export const THEME_STORAGE_KEY = "mart-inventory-theme";

export const LOW_STOCK_OPTIONS = [5, 10, 15, 20, 25, 50] as const;

export const SESSION_TIMEOUT_OPTIONS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "4 hours", value: 240 },
  { label: "Never", value: 0 },
] as const;

export const INVENTORY_UNITS = ["Units", "Kg", "Liters", "Boxes", "Packs"] as const;

export const EXPORT_FORMATS = ["CSV", "PDF", "Excel"] as const;

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Urdu", value: "ur" },
  { label: "Arabic", value: "ar" },
] as const;

export const TIMEZONE_OPTIONS = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Europe/London",
  "America/New_York",
] as const;

export const DEFAULT_SETTINGS = {
  email: "",
  restaurantName: "MariaDB Mart",
  branchName: "Main Branch",
  lowStockThreshold: 10,
  autoReorder: false,
  defaultUnit: "Units" as (typeof INVENTORY_UNITS)[number],
  emailAlerts: true,
  vendorRequestAlerts: true,
  stockAlerts: true,
  dailyDigest: false,
  twoFactorEnabled: false,
  sessionTimeout: 60,
  exportFormat: "CSV" as (typeof EXPORT_FORMATS)[number],
  language: "en",
  timezone: "Asia/Karachi",
  darkMode: false,
};
