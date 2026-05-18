import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Users, Building2, ArrowRight } from 'lucide-react';
import { DecisionCard } from '../../components/DecisionCard';
import { PageBackground } from '../../components/PageBackground';
import { PageHeader } from '../../components/PageHeader';

type DecisionType = 'join' | 'create' | null;

export function OrganizationDecision() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<DecisionType>(null);

  const handleContinue = () => {
    if (selectedOption) {
      navigate('/dashboard');
    }
  };

  const storedFirstName = localStorage.getItem('firstName') || '';

  return (
    <div
      className="h-screen w-full relative overflow-hidden flex items-center justify-center"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(to bottom right, #F8F9FC 0%, #FFFFFF 50%, #F0F4FF 100%)'
      }}
    >
      <PageBackground />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto px-8"
      >
        <PageHeader 
          title={`Choose Your Path Forward, ${storedFirstName}`}
          subtitle="Select the option that best fits your needs to begin your journey with Tarakki"
        />

        {/* Option Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-10 mb-16 justify-center max-w-5xl mx-auto"
        >
          <DecisionCard
            title="Join an Organization"
            description="Collaborate with your team instantly using an invite code or workspace link"
            icon={Users}
            isSelected={selectedOption === 'join'}
            onClick={() => setSelectedOption('join')}
          />

          <DecisionCard
            title="Create an Organization"
            description="Build your workspace from scratch and invite your team to collaborate"
            icon={Building2}
            isSelected={selectedOption === 'create'}
            onClick={() => setSelectedOption('create')}
          />
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
