import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20"
      >
        <img src="/tarakki_logo_fav.png" alt="Tarakki Logo" className="w-8 h-8 object-contain" />
        <span className="text-[24px] font-semibold text-gray-900 tracking-tight">Tarakki</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-[48px] font-bold text-gray-900 mb-5 tracking-tight leading-tight"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-[20px] text-[#6B7280] max-w-3xl mx-auto leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
