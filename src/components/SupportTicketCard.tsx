interface SupportTicketCardProps {
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-600",
  PENDING: "bg-yellow-50 text-yellow-600",
  IN_PROGRESS: "bg-purple-50 text-purple-600",
  RESOLVED: "bg-green-50 text-green-600",
  CLOSED: "bg-red-100 text-gray-600",
};

export function SupportTicketCard({
  title,
  description,
  category,
  status,
  createdAt,
  updatedAt,
}: SupportTicketCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Top section */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mt-1 text-base font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Status */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[status.toUpperCase()] || "bg-gray-100 text-gray-600"
          }`}>
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-500">{description}</p>

      {/* Bottom section */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{category}</span>
          <span>Created {createdAt}</span>
          <span>Updated {updatedAt}</span>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-[#0073EA] hover:text-[#005FCC]">
          View Details
        </button>
      </div>
    </div>
  );
}
