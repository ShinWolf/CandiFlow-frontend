import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { profile } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">CandiFlow</h1>
      <nav className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-blue-600 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/applications"
          className="text-sm text-gray-500 hover:text-blue-600 transition"
        >
          Candidatures
        </Link>
        <Link
          to="/profile"
          className="text-sm text-gray-500 hover:text-blue-600 transition font-medium text-blue-600"
        >
          {profile?.username ?? profile?.email ?? "Profil"}
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
