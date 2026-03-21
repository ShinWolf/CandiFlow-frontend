import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { profile, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/applications"
          className="text-lg font-semibold text-green-700 dark:text-green-400"
        >
          CandiFlow
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-3">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={linkClass("/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            to="/applications"
            onClick={() => setMenuOpen(false)}
            className={linkClass("/applications")}
          >
            Candidatures
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={linkClass("/profile")}
          >
            {profile?.username ?? profile?.email ?? "Profil"}
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-left text-red-500 dark:text-red-400 hover:text-red-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
