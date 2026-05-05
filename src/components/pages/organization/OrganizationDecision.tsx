import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Users, Building2, ArrowRight, Check } from 'lucide-react';

type DecisionType = 'join' | 'create' | null;

export function OrganizationDecision() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<DecisionType>(null);

  const handleContinue = () => {
    if (selectedOption) {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="h-screen w-full relative overflow-hidden flex items-center justify-center"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(to bottom right, #F8F9FC 0%, #FFFFFF 50%, #F0F4FF 100%)'
      }}
    >
      {/* Professional Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0073EA 0.5px, transparent 0.5px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-1/3 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0,115,234,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto px-8"
      >
        {/* Logo/Brand Section */}
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
            Choose Your Path Forward
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[20px] text-[#6B7280] max-w-3xl mx-auto leading-relaxed"
          >
            Select the option that best fits your needs to begin your journey with Tarakki
          </motion.p>
        </div>

        {/* Option Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-10 mb-16 justify-center max-w-5xl mx-auto"
        >
          {/* Join Organization Card */}
          <motion.div
            onClick={() => setSelectedOption('join')}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full max-w-md p-12 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden ${
              selectedOption === 'join'
                ? 'bg-gradient-to-br from-[#0073EA] to-[#0062C9] shadow-[0px_30px_60px_rgba(0,115,234,0.25)]'
                : 'bg-white/60 backdrop-blur-sm hover:shadow-[0px_20px_40px_rgba(0,115,234,0.1)] shadow-[0px_10px_30px_rgba(0,0,0,0.08)] border border-white/40'
            }`}
          >
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="relative">
                <motion.div
                  className={`p-6 rounded-2xl ${
                    selectedOption === 'join'
                      ? 'bg-white/20 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-[#F6F7FB] to-[#E5E7EB]'
                  } transition-all duration-500`}
                >
                  <Users className={`w-12 h-12 ${
                    selectedOption === 'join' ? 'text-white' : 'text-[#6B7280]'
                  } transition-colors duration-500`} />
                </motion.div>

                {selectedOption === 'join' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00C875] flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className={`text-[26px] font-bold tracking-tight transition-colors duration-500 ${
                  selectedOption === 'join' ? 'text-white' : 'text-gray-900'
                }`}>
                  Join an Organization
                </h3>
                <p className={`text-[16px] leading-relaxed transition-colors duration-500 ${
                  selectedOption === 'join' ? 'text-white/90' : 'text-[#6B7280]'
                }`}>
                  Collaborate with your team instantly using an invite code or workspace link
                </p>
              </div>
            </div>
          </motion.div>

          {/* Create Organization Card */}
          <motion.div
            onClick={() => setSelectedOption('create')}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full max-w-md p-12 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden ${
              selectedOption === 'create'
                ? 'bg-gradient-to-br from-[#0073EA] to-[#0062C9] shadow-[0px_30px_60px_rgba(0,115,234,0.25)]'
                : 'bg-white/60 backdrop-blur-sm hover:shadow-[0px_20px_40px_rgba(0,115,234,0.1)] shadow-[0px_10px_30px_rgba(0,0,0,0.08)] border border-white/40'
            }`}
          >
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="relative">
                <motion.div
                  className={`p-6 rounded-2xl ${
                    selectedOption === 'create'
                      ? 'bg-white/20 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-[#F6F7FB] to-[#E5E7EB]'
                  } transition-all duration-500`}
                >
                  <Building2 className={`w-12 h-12 ${
                    selectedOption === 'create' ? 'text-white' : 'text-[#6B7280]'
                  } transition-colors duration-500`} />
                </motion.div>

                {selectedOption === 'create' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00C875] flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className={`text-[26px] font-bold tracking-tight transition-colors duration-500 ${
                  selectedOption === 'create' ? 'text-white' : 'text-gray-900'
                }`}>
                  Create an Organization
                </h3>
                <p className={`text-[16px] leading-relaxed transition-colors duration-500 ${
                  selectedOption === 'create' ? 'text-white/90' : 'text-[#6B7280]'
                }`}>
                  Build your workspace from scratch and invite your team to collaborate
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleContinue}
            disabled={!selectedOption}
            whileHover={selectedOption ? { scale: 1.05 } : {}}
            whileTap={selectedOption ? { scale: 0.95 } : {}}
            className={`group relative px-16 py-5 rounded-2xl text-[17px] font-semibold transition-all duration-300 ${
              selectedOption
                ? 'bg-[#0073EA] text-white cursor-pointer shadow-[0px_20px_40px_rgba(0,115,234,0.3)]'
                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Continue to Dashboard
              {selectedOption && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
