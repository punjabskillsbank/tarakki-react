import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function EntranceTransition({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Wait a bit after 100% to let the user see it
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center max-w-sm w-full space-y-12 px-6">
        {/* Animated Logo Container */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.34, 1.56, 0.64, 1] // Custom bouncy easing
            }}
            className="w-20 h-20 bg-white rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-500/30 overflow-hidden border border-blue-100"
          >
            <img src="/tarakki_logo.png" alt="Tarakki Logo" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Subtle pulse ring */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 border-2 border-[#0073EA] rounded-[30px] -z-10"
          />
        </div>

        {/* Text Section */}
        <div className="text-center space-y-3">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[28px] font-bold text-gray-900 tracking-tight"
          >
            Entering Tarakki
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[17px] text-[#6B7280] font-medium"
          >
            Preparing your workspace and boards...
          </motion.p>
        </div>

        {/* Progress Bar Area */}
        <div className="w-full space-y-4">
          <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#0073EA] to-[#60A5FA]"
            />
          </div>
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
            <span>initializing</span>
            <span>{Math.round(progress)}%</span>
            <span>ready</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-60"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-60"
        />
      </div>
    </motion.div>
  );
}
