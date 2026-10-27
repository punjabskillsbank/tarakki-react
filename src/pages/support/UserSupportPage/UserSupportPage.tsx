import { PageBackground } from "../../../components/PageBackground";
import { PageHeader } from "../../../components/PageHeader";
import { UserSupportPageFAQ } from "./UserSupportPageFAQ";
import { UserSupportPageForm } from "./UserSupportPageForm";
import { History } from "lucide-react";

export function UserSupportPage() {
  return (
    <div className="p-6">
      <PageBackground></PageBackground>
      <div>
        <div className="relative">
          <PageHeader
            title="User Support"
            subtitle="Need help? Submit a support request, browse frequently asked questions, or review your previous support conversations."
          />

          <button
            type="button"
            className="absolute right-0 top-0 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50">
            <History size={18} />
            Support History
          </button>
        </div>
        <div className="flex gap-8 p-8">
          <div className="flex-2">
            <UserSupportPageForm />
          </div>
          <div className="flex-1">
            <UserSupportPageFAQ />
          </div>
        </div>
      </div>
    </div>
  );
}
