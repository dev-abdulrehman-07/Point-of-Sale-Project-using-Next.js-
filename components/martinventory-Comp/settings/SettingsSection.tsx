import React from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6 dark:border-zinc-800">
        <div className="flex items-start gap-3">
          {icon && (
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#ccff661a", color: "#ccff66" }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}
