import { NavLink } from "react-router-dom";
import { Home, Compass, MessageCircle, Bell, Settings, User, LogOut } from "lucide-react";

const navItems = [
  { to: "/dashboard", end: true, icon: Home, label: "Feed" },
  { to: "/dashboard/explore", icon: Compass, label: "Explore" },
  { to: "/dashboard/messages", icon: MessageCircle, label: "Messages" },
  { to: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="hidden lg:flex flex-col w-20 xl:w-56 shrink-0 border-r border-glassBorder px-3 py-6 gap-1">
      <div className="px-2 mb-8">
        <span className="font-display text-xl font-extrabold text-paper hidden xl:inline">
          sylva
        </span>
        <span className="font-display text-xl font-extrabold text-paper xl:hidden block text-center">
          s
        </span>
      </div>

      {navItems.map(({ to, end, icon: Icon, label }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-white/[0.06] text-paper"
                : "text-fog hover:bg-white/[0.04] hover:text-paper"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                strokeWidth={2}
                className={isActive ? "text-teal" : "group-hover:text-teal transition-colors"}
              />
              <span className="hidden xl:inline font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fog hover:bg-white/[0.04] hover:text-paper transition-colors"
      >
        <LogOut size={20} strokeWidth={2} />
        <span className="hidden xl:inline font-medium">Log out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
