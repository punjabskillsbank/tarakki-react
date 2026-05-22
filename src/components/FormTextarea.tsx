import React from 'react';
import { cn } from '../utils/cn';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function FormTextarea({ label, error, id, className, style, ...props }: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-gray-900 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          'w-full px-3 py-3 rounded-lg border transition-all duration-200 resize-none outline-none',
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
