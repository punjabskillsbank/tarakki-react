import React, { useState } from "react";
import { cn } from "../utils/cn";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showCount?: boolean;
}

export function FormInput({
  label,
  error,
  id,
  className,
  style,
  showCount,
  maxLength,
  onChange,
  ...props
}: FormInputProps) {
  const [charCount, setCharCount] = useState(() => {
    return String(props.value || props.defaultValue || "").length;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e);
    }
  };

  const currentLength =
    props.value !== undefined ? String(props.value).length : charCount;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-[14px] font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        maxLength={maxLength}
        className={cn(
          "w-full h-11 px-3 rounded-lg border transition-all duration-200 outline-none",
          error
            ? "border-[#E2445C] focus:border-[#E2445C] focus:shadow-[0_0_0_2px_rgba(226,68,92,0.1)]"
            : "border-[#D1D5DB] focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]",
          className
        )}
        style={{ fontSize: "14px", ...style }}
        onChange={handleChange}
        {...props}
      />
      {(error || showCount) && (
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {error && <p className="text-[12px] text-[#E2445C]">{error}</p>}
          </div>
          {showCount && (
            <span className="text-[12px] text-gray-500 ml-2 whitespace-nowrap">
              {maxLength ? `${currentLength} / ${maxLength}` : currentLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
