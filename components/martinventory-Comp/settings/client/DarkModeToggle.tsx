"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { SettingsToggleRow } from "../SettingsToggleRow";
import { ToggleSwitch } from "./ToggleSwitch";
import { useSettings } from "./SettingsProvider";

export function DarkModeToggle() {
  const { isDark, setDarkMode, showToast } = useSettings();

  const handleToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    showToast("success", enabled ? "Dark mode enabled." : "Light mode enabled.");
  };

  return (
    <SettingsToggleRow
      title="Dark Mode"
      description="Switch between light and dark interface for comfortable inventory management."
      className="border-[#ccff66]/20"
    >
      <div className="flex items-center gap-2">
        <Sun
          size={16}
          className={isDark ? "text-zinc-500" : "text-[#ccff66]"}
          aria-hidden="true"
        />
        <ToggleSwitch
          checked={isDark}
          onChange={handleToggle}
          label="Toggle dark mode"
        />
        <Moon
          size={16}
          className={isDark ? "text-[#ccff66]" : "text-zinc-500"}
          aria-hidden="true"
        />
      </div>
    </SettingsToggleRow>
  );
}
