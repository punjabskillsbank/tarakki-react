import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

console.log(cn(
  "px-6 h-11 rounded-lg text-[14px] font-medium text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2",
  false ? "opacity-70 cursor-not-allowed bg-[#0073EA]" : "bg-[#0073EA] hover:bg-[#005FCC]",
  undefined
));
