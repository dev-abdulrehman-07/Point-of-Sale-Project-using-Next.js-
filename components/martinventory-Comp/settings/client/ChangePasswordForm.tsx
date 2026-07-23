"use client";

import React, { useId, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, Save } from "lucide-react";
import { FieldLabel } from "../FieldLabel";
import { inputClassName, primaryButtonClassName } from "../shared-styles";
import { LIME } from "../constants";
import { useSettings } from "./SettingsProvider";

export function ChangePasswordForm() {
  const formId = useId();
  const { showToast } = useSettings();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast("error", "Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("error", "New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("success", "Password changed successfully.");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <FieldLabel htmlFor={`${formId}-current`} required>
          Current Password
        </FieldLabel>
        <div className="relative">
          <KeyRound
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id={`${formId}-current`}
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className={`${inputClassName} pr-10 pl-10`}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${formId}-new`} required>
            New Password
          </FieldLabel>
          <div className="relative">
            <input
              id={`${formId}-new`}
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={`${inputClassName} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor={`${formId}-confirm`} required>
            Confirm Password
          </FieldLabel>
          <input
            id={`${formId}-confirm`}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className={inputClassName}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={primaryButtonClassName}
        style={{ backgroundColor: LIME }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save size={16} />
            Change Password
          </>
        )}
      </button>
    </form>
  );
}
