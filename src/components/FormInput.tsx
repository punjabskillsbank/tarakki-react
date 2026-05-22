import React from 'react';
import { cn } from '../utils/cn';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, id, className, style, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-gray-900 mb-2">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'w-full h-11 px-3 rounded-lg border transition-all duration-200 outline-none',
          error
            ? 'border-[#E2445C] focus:border-[#E2445C] focus:shadow-[0_0_0_2px_rgba(226,68,92,0.1)]'
            : 'border-[#D1D5DB] focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]',
          className
        )}
        style={{ fontSize: '14px', ...style }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-[12px] text-[#E2445C]">
          {error}
        </p>
      )}
    </div>
  );
}
