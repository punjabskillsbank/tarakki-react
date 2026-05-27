import React from "react";

export function FieldWrapper({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} <span className="text-[#E2445C]">*</span>
      </label>
      {children}
      {error && (
        <p className="text-xs text-[#E2445C] animate-[fadeIn_150ms_ease-in]">
          {error}
        </p>
      )}
    </div>
  );
}
