import React from "react";
import { cn } from "@/lib/utils";

interface SettingsToggleRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsToggleRow({
  title,
  description,
  children,
  className,
}: SettingsToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3.5 dark:border-zinc-800 dark:bg-zinc-800/50",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
