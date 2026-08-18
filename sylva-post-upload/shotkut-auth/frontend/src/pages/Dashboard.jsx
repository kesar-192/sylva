import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TopHeader from "../components/TopHeader.jsx";
import FAB from "../components/FAB.jsx";
import AnimatedOutlet from "../components/AnimatedOutlet.jsx";

// Layout shell for everything under /dashboard/* - sidebar + header stay
// mounted while <Outlet/> swaps in Feed / Explore / Messages /
// Notifications / Settings based on the route.
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-ink font-body flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopHeader user={user} onLogout={handleLogout} />
        <AnimatedOutlet />
      </div>

      <FAB />
    </div>
  );
};

export default Dashboard;
