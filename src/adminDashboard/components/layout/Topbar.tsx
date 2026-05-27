export function Topbar() {
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
      

        {/* <button
          className="relative grid size-7 place-items-center rounded-md border-0 bg-transparent p-0 text-inherit hover:bg-[#e9f2ff] hover:text-[#0f7bf2]"
          type="button"
          aria-label="Search"
          title="Search"
        >
          <Search size={20} />
        </button>
        <button
          className="relative grid size-7 place-items-center rounded-md border-0 bg-transparent p-0 text-inherit after:absolute after:right-1 after:top-[3px] after:size-[7px] after:rounded-full after:border-2 after:border-white after:bg-[#f15d75] after:content-[''] hover:bg-[#e9f2ff] hover:text-[#0f7bf2]"
          type="button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
        </button>
        <button
          className="relative grid size-7 place-items-center rounded-md border-0 bg-transparent p-0 text-inherit hover:bg-[#e9f2ff] hover:text-[#0f7bf2]"
          type="button"
          aria-label="Help"
          title="Help"
        >
          <CircleHelp size={19} />
        </button>
        <button
          className="relative grid size-7 place-items-center rounded-md border-0 bg-transparent p-0 text-inherit hover:bg-[#e9f2ff] hover:text-[#0f7bf2]"
          type="button"
          aria-label="Theme"
          title="Theme"
        >
          <Moon size={19} />
        </button> */}
        <span
          className="grid size-[34px] place-items-center rounded-full bg-[#0f7bf2] text-[13px] font-extrabold text-white"
          aria-label="Admin profile"
        >
          AD
        </span>
      </div>
    </header>
  );
}
