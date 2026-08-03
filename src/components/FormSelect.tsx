import React from "react";
import { cn } from "../utils/cn";

type Option = {
  value: string;
  label: string;
};

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export function FormSelect({
  label,
  error,
  id,
  className,
  options,
  style,
  ...props
}: FormSelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-[14px] font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}

      <select
        id={id}
        className={cn(
          "w-full h-11 px-3 rounded-lg border transition-all duration-200 outline-none",
          error
            ? "border-[#E2445C] focus:border-[#E2445C] focus:shadow-[0_0_0_2px_rgba(226,68,92,0.1)]"
            : "border-[#D1D5DB] focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]",
          className
        )}
        style={{ fontSize: "14px", ...style }}
        {...props}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-[12px] text-[#E2445C]">{error}</p>}
    </div>
  );
}
