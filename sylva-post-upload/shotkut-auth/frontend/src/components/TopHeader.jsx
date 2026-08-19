import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

const TopHeader = ({ user, onLogout }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate("/dashboard/explore");
  };

  return (
    <header className="sticky top-0 z-20 glass border-x-0 border-t-0 px-4 sm:px-6 py-3 flex items-center gap-4">
      <span className="font-display text-lg font-extrabold text-paper lg:hidden">
        sylva
      </span>

      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-md hidden sm:flex items-center gap-2 rounded-full bg-white/[0.05] border border-glassBorder px-4 py-2"
      >
        <Search size={16} className="text-fog shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search #trending, people, vibes..."
          className="bg-transparent text-sm text-paper placeholder-fog outline-none w-full"
        />
      </form>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={onLogout}
          className="lg:hidden text-fog hover:text-paper transition"
          aria-label="Log out"
        >
          <LogOut size={19} />
        </button>

        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="relative text-fog hover:text-paper transition"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal status-dot" />
        </button>

        <button onClick={() => navigate("/dashboard/profile")} aria-label="View profile" className="aura-ring">
          <div className="w-9 h-9 rounded-full bg-charcoal flex items-center justify-center m-[3px] overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-paper">{getInitials(user?.name) || "?"}</span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
