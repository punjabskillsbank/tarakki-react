import { motion } from 'motion/react';
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, id, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-gray-900 mb-2">
        {label}
      </label>
      <input
        id={id}
        className={`w-full h-11 px-3 rounded-lg border transition-all duration-200 outline-none ${
          error
            ? 'border-[#E2445C] focus:border-[#E2445C] focus:shadow-[0_0_0_2px_rgba(226,68,92,0.1)]'
            : 'border-[#D1D5DB] focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]'
        } ${props.className || ''}`}
        style={{ fontSize: '14px', ...props.style }}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-1 text-[12px] text-[#E2445C]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
