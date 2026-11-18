export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img
            src="/tarakki_logo_fav.png"
            alt="Tarakki Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-gray-900 tracking-tight">
            Tarakki
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            P
          </div>
        </div>
      </div>
    </nav>
  );
}
