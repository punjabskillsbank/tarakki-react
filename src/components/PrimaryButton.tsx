import { motion } from 'motion/react';
import React from 'react';

interface PrimaryButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return (
    <motion.button
      whileHover={{ backgroundColor: '#005FCC' }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 h-11 rounded-lg text-[14px] font-medium text-white bg-[#0073EA] hover:bg-[#005FCC] transition-all duration-200 shadow-sm ${props.className || ''}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
