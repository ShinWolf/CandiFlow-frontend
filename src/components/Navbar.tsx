import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { profile, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path: string) =>
    `text-sm transition-colors ${
      location.pathname === path
        ? "text-green-700 dark:text-green-400 font-medium"
        : "text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors duration-200">
      <Link
        to="/applications"
        className="text-lg font-semibold text-green-700 dark:text-green-400"
      >
        CandiFlow
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/applications" className={linkClass("/applications")}>
          Candidatures
        </Link>
        <Link to="/profile" className={linkClass("/profile")}>
          {profile?.username ?? profile?.email ?? "Profil"}
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          title={dark ? "Mode clair" : "Mode sombre"}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-green-500 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={handleLogout}
          title="Déconnexion"
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-400 dark:hover:border-red-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
