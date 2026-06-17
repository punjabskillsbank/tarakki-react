import { motion } from 'motion/react';
import React from 'react';
import { cn } from '../utils/cn';


interface PrimaryButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function PrimaryButton({ children, isLoading, className, ...props }: PrimaryButtonProps) {
  return (
    <motion.button
      whileHover={isLoading || props.disabled ? {} : { backgroundColor: '#005FCC' }}
      whileTap={isLoading || props.disabled ? {} : { scale: 0.98 }}
      disabled={isLoading || props.disabled}
      className={cn(
        "px-6 h-11 rounded-lg text-[14px] font-medium text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2",
        isLoading ? "opacity-70 cursor-not-allowed bg-[#0073EA]" : "bg-[#0073EA] hover:bg-[#005FCC]",
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
}
