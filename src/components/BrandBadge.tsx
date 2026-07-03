import { motion } from 'motion/react';

export function BrandBadge() {
  return (
    <div className="flex justify-center mb-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#0073EA]/5 to-[#6C63FF]/5 border border-[#0073EA]/10"
      >
        <img src="/tarakki_logo_fav.png" alt="Tarakki Logo" className="w-5 h-5 object-contain" />
        <span className="text-[18px] font-bold text-gray-900 tracking-tight">
          Tarakki
        </span>
      </motion.div>
    </div>
  );
}
