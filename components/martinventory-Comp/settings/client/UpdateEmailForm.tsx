"use client";

import React, { useEffect, useId, useState } from "react";
import { Loader2, Mail, Save } from "lucide-react";
import { FieldLabel } from "../FieldLabel";
import { inputClassName, primaryButtonClassName } from "../shared-styles";
import { LIME } from "../constants";
import { useSettings } from "./SettingsProvider";

export function UpdateEmailForm() {
  const formId = useId();
  const { settings, updateSettings, showToast } = useSettings();
  const [email, setEmail] = useState(settings.email);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUser = localStorage.getItem("velvetUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as { email?: string };
        if (parsed.email) {
          setEmail(parsed.email);
          return;
        }
      } catch {
      }
    }
    if (settings.email) setEmail(settings.email);
  }, [settings.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateSettings({ email: trimmed });

    const savedUser = localStorage.getItem("velvetUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        localStorage.setItem(
          "velvetUser",
          JSON.stringify({ ...parsed, email: trimmed }),
        );
      } catch {
      }
    }

    showToast("success", "Email updated successfully.");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <FieldLabel htmlFor={`${formId}-email`} required>
          Email Address
        </FieldLabel>
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id={`${formId}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manager@restaurant.com"
            className={`${inputClassName} pl-10`}
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
            Updating...
          </>
        ) : (
          <>
            <Save size={16} />
            Update Email
          </>
        )}
      </button>
    </form>
  );
}
