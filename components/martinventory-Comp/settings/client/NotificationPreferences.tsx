"use client";

import React from "react";
import { SettingsToggleRow } from "../SettingsToggleRow";
import { ToggleSwitch } from "./ToggleSwitch";
import { useSettings } from "./SettingsProvider";

export function NotificationPreferences() {
  const { settings, updateSettings, showToast } = useSettings();

  const handleToggle = (
    key: "emailAlerts" | "vendorRequestAlerts" | "stockAlerts" | "dailyDigest",
    label: string,
    value: boolean,
  ) => {
    updateSettings({ [key]: value });
    showToast("success", `${label} ${value ? "enabled" : "disabled"}.`);
  };

  return (
    <div className="space-y-3">
      <SettingsToggleRow
        title="Email Alerts"
        description="Receive important inventory updates via email."
      >
        <ToggleSwitch
          checked={settings.emailAlerts}
          onChange={(v) => handleToggle("emailAlerts", "Email alerts", v)}
          label="Toggle email alerts"
        />
      </SettingsToggleRow>

      <SettingsToggleRow
        title="Vendor Request Alerts"
        description="Get notified when vendors send new supply requests."
      >
        <ToggleSwitch
          checked={settings.vendorRequestAlerts}
          onChange={(v) =>
            handleToggle("vendorRequestAlerts", "Vendor request alerts", v)
          }
          label="Toggle vendor request alerts"
        />
      </SettingsToggleRow>

      <SettingsToggleRow
        title="Low Stock Alerts"
        description="Instant alerts when items fall below the threshold."
      >
        <ToggleSwitch
          checked={settings.stockAlerts}
          onChange={(v) => handleToggle("stockAlerts", "Stock alerts", v)}
          label="Toggle stock alerts"
        />
      </SettingsToggleRow>

      <SettingsToggleRow
        title="Daily Digest"
        description="A summary of inventory activity every morning."
      >
        <ToggleSwitch
          checked={settings.dailyDigest}
          onChange={(v) => handleToggle("dailyDigest", "Daily digest", v)}
          label="Toggle daily digest"
        />
      </SettingsToggleRow>
    </div>
  );
}
