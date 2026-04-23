interface PillButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function PillButton({ children, selected = false, onClick }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-full border-2 transition-all duration-200
        hover:scale-105 active:scale-95
        ${selected 
          ? 'border-[#0073EA] bg-[#E6F0FF] text-[#0073EA]' 
          : 'border-[#D1D5DB] bg-white text-gray-700 hover:border-gray-400'
        }
      `}
    >
      {children}
    </button>
  );
}
