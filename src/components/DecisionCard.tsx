import { motion } from 'motion/react';
import { type LucideIcon, Check } from 'lucide-react';

interface DecisionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
}

export function DecisionCard({ title, description, icon: Icon, isSelected, onClick }: DecisionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full max-w-md p-12 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[#0073EA] focus:ring-offset-4 ${
        isSelected
          ? 'bg-gradient-to-br from-[#0073EA] to-[#0062C9] shadow-[0px_30px_60px_rgba(0,115,234,0.25)]'
          : 'bg-white/60 backdrop-blur-sm hover:shadow-[0px_20px_40px_rgba(0,115,234,0.1)] shadow-[0px_10px_30px_rgba(0,0,0,0.08)] border border-white/40'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        {/* Icon */}
        <div className="relative">
          <motion.div
            className={`p-6 rounded-2xl ${
              isSelected
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-[#F6F7FB] to-[#E5E7EB]'
            } transition-all duration-500`}
          >
            <Icon className={`w-12 h-12 ${
              isSelected ? 'text-white' : 'text-[#6B7280]'
            } transition-colors duration-500`} />
          </motion.div>

          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              data-testid="check-icon"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00C875] flex items-center justify-center shadow-lg"
            >
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className={`text-[26px] font-bold tracking-tight transition-colors duration-500 ${
            isSelected ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`text-[16px] leading-relaxed transition-colors duration-500 ${
            isSelected ? 'text-white/90' : 'text-[#6B7280]'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
