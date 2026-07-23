"use client";

import React, { useId } from "react";
import { Loader2, Package, Save } from "lucide-react";
import { FieldLabel } from "../FieldLabel";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
} from "../shared-styles";
import {
  EXPORT_FORMATS,
  INVENTORY_UNITS,
  LOW_STOCK_OPTIONS,
  LIME,
} from "../constants";
import { SettingsToggleRow } from "../SettingsToggleRow";
import { ToggleSwitch } from "./ToggleSwitch";
import { useSettings } from "./SettingsProvider";

export function InventoryPreferences() {
  const formId = useId();
  const { settings, updateSettings, showToast } = useSettings();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    showToast("success", "Inventory preferences saved.");
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${formId}-threshold`}>
            Low Stock Threshold
          </FieldLabel>
          <select
            id={`${formId}-threshold`}
            value={settings.lowStockThreshold}
            onChange={(e) =>
              updateSettings({ lowStockThreshold: Number(e.target.value) })
            }
            className={selectClassName}
          >
            {LOW_STOCK_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value} units
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor={`${formId}-unit`}>Default Unit</FieldLabel>
          <select
            id={`${formId}-unit`}
            value={settings.defaultUnit}
            onChange={(e) =>
              updateSettings({
                defaultUnit: e.target.value as (typeof INVENTORY_UNITS)[number],
              })
            }
            className={selectClassName}
          >
            {INVENTORY_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SettingsToggleRow
        title="Auto-Reorder Suggestions"
        description="Suggest reorders when stock hits the threshold."
      >
        <ToggleSwitch
          checked={settings.autoReorder}
          onChange={(value) => {
            updateSettings({ autoReorder: value });
            showToast(
              "success",
              `Auto-reorder ${value ? "enabled" : "disabled"}.`,
            );
          }}
          label="Toggle auto-reorder"
        />
      </SettingsToggleRow>

      <div>
        <FieldLabel htmlFor={`${formId}-export`}>
          Default Export Format
        </FieldLabel>
        <select
          id={`${formId}-export`}
          value={settings.exportFormat}
          onChange={(e) =>
            updateSettings({
              exportFormat: e.target.value as (typeof EXPORT_FORMATS)[number],
            })
          }
          className={selectClassName}
        >
          {EXPORT_FORMATS.map((format) => (
            <option key={format} value={format}>
              {format}
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
            <Package size={16} />
            Save Preferences
          </>
        )}
      </button>
    </form>
  );
}
