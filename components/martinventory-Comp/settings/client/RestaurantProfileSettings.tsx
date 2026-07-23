"use client";

import React, { useId } from "react";
import { Building2, Globe, Loader2, Save } from "lucide-react";
import { FieldLabel } from "../FieldLabel";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
} from "../shared-styles";
import { LANGUAGE_OPTIONS, LIME, TIMEZONE_OPTIONS } from "../constants";
import { useSettings } from "./SettingsProvider";

export function RestaurantProfileSettings() {
  const formId = useId();
  const { settings, updateSettings, showToast } = useSettings();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings.restaurantName.trim() || !settings.branchName.trim()) {
      showToast("error", "Restaurant and branch name are required.");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    showToast("success", "Restaurant profile updated.");
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${formId}-restaurant`} required>
            Restaurant Name
          </FieldLabel>
          <div className="relative">
            <Building2
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id={`${formId}-restaurant`}
              type="text"
              value={settings.restaurantName}
              onChange={(e) =>
                updateSettings({ restaurantName: e.target.value })
              }
              placeholder="MariaDB Mart"
              className={`${inputClassName} pl-10`}
              required
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor={`${formId}-branch`} required>
            Branch Name
          </FieldLabel>
          <input
            id={`${formId}-branch`}
            type="text"
            value={settings.branchName}
            onChange={(e) => updateSettings({ branchName: e.target.value })}
            placeholder="Main Branch"
            className={inputClassName}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${formId}-language`}>Language</FieldLabel>
          <select
            id={`${formId}-language`}
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className={selectClassName}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor={`${formId}-timezone`}>Timezone</FieldLabel>
          <div className="relative">
            <Globe
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <select
              id={`${formId}-timezone`}
              value={settings.timezone}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
              className={`${selectClassName} pl-10`}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
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
            <Save size={16} />
            Save Profile
          </>
        )}
      </button>
    </form>
  );
}
