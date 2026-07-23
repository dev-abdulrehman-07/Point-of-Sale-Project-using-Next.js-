"use client";

import React, { useId } from "react";
import { Loader2, Save, Shield } from "lucide-react";
import { FieldLabel } from "../FieldLabel";
import { primaryButtonClassName, selectClassName } from "../shared-styles";
import { LIME, SESSION_TIMEOUT_OPTIONS } from "../constants";
import { SettingsToggleRow } from "../SettingsToggleRow";
import { ToggleSwitch } from "./ToggleSwitch";
import { useSettings } from "./SettingsProvider";

export function SecuritySettings() {
  const formId = useId();
  const { settings, updateSettings, showToast } = useSettings();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    showToast("success", "Security settings updated.");
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4" noValidate>
      <SettingsToggleRow
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your inventory account."
      >
        <ToggleSwitch
          checked={settings.twoFactorEnabled}
          onChange={(value) => {
            updateSettings({ twoFactorEnabled: value });
            showToast(
              "success",
              `Two-factor authentication ${value ? "enabled" : "disabled"}.`,
            );
          }}
          label="Toggle two-factor authentication"
        />
      </SettingsToggleRow>

      <div>
        <FieldLabel htmlFor={`${formId}-session`}>
          Auto Logout After
        </FieldLabel>
        <select
          id={`${formId}-session`}
          value={settings.sessionTimeout}
          onChange={(e) =>
            updateSettings({ sessionTimeout: Number(e.target.value) })
          }
          className={selectClassName}
        >
          {SESSION_TIMEOUT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className={primaryButtonClassName}
        style={{ backgroundColor: LIME }}
      >
        {isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Shield size={16} />
            Save Security Settings
          </>
        )}
      </button>
    </form>
  );
}
