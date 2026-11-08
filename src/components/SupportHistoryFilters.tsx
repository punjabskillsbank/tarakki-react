import { Search } from "lucide-react";
import { FormSelect } from "./FormSelect";

type SupportHistoryFiltersProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
};

export function SupportHistoryFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
}: SupportHistoryFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search support requests..."
          className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500"
        />
      </div>

      {/* Status */}
      <FormSelect
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
        options={[
          { value: "ALL", label: "Status: All" },
          { value: "OPEN", label: "Status: Open" },
          { value: "PENDING", label: "Status: Pending" },
          { value: "RESOLVED", label: "Status: Resolved" },
          { value: "CLOSED", label: "Status: Closed" },
        ]}
        className="h-10 w-auto min-w-[120px] bg-white"
      />

      {/* Category */}
      <FormSelect
        value={selectedCategory}
        onChange={(event) => setSelectedCategory(event.target.value)}
        options={[
          { value: "ALL", label: "Category: All" },
          { value: "ACCOUNT", label: "Category: Account" },
          { value: "BOARDS", label: "Category: Boards" },
          { value: "TEAM", label: "Category: Team" },
          { value: "GENERAL", label: "Category: General" },
        ]}
        className="h-10 w-auto min-w-[130px] bg-white"
      />

      {/* Date */}
      <input
        type="date"
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600"
      />
    </div>
  );
}
