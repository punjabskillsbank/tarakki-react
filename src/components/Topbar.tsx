import { LogOut } from "lucide-react";
import { clearAuth } from "../utils/authStorage";
import config from "../config/indexConfig";

export function Topbar() {
  const handleLogout = () => {
    clearAuth();
    window.location.assign(config.routes.login);
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e7ebf2] bg-white px-5 shadow-[0_1px_6px_rgba(15,23,42,0.04)] max-[760px]:h-16 max-[760px]:px-4">
      <div className="inline-flex min-w-0 items-center gap-3">
        <img className="h-8 w-auto shrink-0" src="/tarakki_logo.png" alt="Tarakki" />
        <span className="whitespace-nowrap text-[15px] font-bold text-[#111827] max-[760px]:hidden">
          Tarakki Admin
        </span>
      </div>

{/* For future references and features like help in admin dashboard topbar and light/dark mode */}
      <div className="flex items-center gap-[18px] text-[#9aa3b2] max-[760px]:gap-2">
        <span
          className="grid size-[34px] place-items-center rounded-full bg-[#0f7bf2] text-[13px] font-extrabold text-white"
          aria-label="Admin profile"
          role="img"
        >
          AD
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-[#6B7280] hover:bg-gray-100 hover:text-[#111827] transition-colors"
          aria-label="Log out"
        >
          <LogOut className="size-4" />
          <span className="max-[760px]:hidden">Log out</span>
        </button>
      </div>
    </header>
  );
}
