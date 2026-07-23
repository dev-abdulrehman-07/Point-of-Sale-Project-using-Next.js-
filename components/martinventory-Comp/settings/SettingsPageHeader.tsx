import React from "react";
import { Settings } from "lucide-react";
import { LIME } from "./constants";

export function SettingsPageHeader() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${LIME}1a`, color: LIME }}
        >
          <Settings size={22} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-zinc-50">
            Inventory Manager Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Manage your account, security, notifications, and inventory preferences.
          </p>
        </div>
      </div>
    </header>
  );
}
