import type { ReactNode } from "react";

interface SupportSummaryCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  iconBackground: string;
  iconColor: string;
}

export function SupportSummaryCard({
  icon,
  value,
  label,
  iconBackground,
  iconColor,
}: SupportSummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBackground} ${iconColor}`}>
        {icon}
      </div>

      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>

        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
