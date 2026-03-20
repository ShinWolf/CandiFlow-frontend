import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, updatePassword } from "../api/user";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const { logout, setProfile: setAuthProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setAuthProfile(data);
        setEmail(data.email);
        setUsername(data.username ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "L'email n'est pas valide";
    if (username && (username.length < 3 || username.length > 30))
      errors.username = "Le pseudo doit contenir entre 3 et 30 caractères";
    return errors;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    setProfileErrors({});
    setProfileLoading(true);
    try {
      const updated = await updateProfile({ email, username });
      setAuthProfile(updated);
      setAuthProfile(updated); // ← met à jour la Navbar immédiatement
      setProfileSuccess("Profil mis à jour avec succès !");
    } catch (err: any) {
      if (err.response?.status === 409) {
        const msg = err.response.data.error;
        if (msg.includes("Email")) setProfileErrors({ email: msg });
        else setProfileErrors({ username: msg });
      } else {
        setProfileErrors({ global: "Une erreur est survenue." });
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!currentPassword)
      errors.currentPassword = "Le mot de passe actuel est obligatoire";
    if (!newPassword)
      errors.newPassword = "Le nouveau mot de passe est obligatoire";
    else if (newPassword.length < 8)
      errors.newPassword = "Au moins 8 caractères";
    if (!confirmNewPassword)
      errors.confirmNewPassword = "Veuillez confirmer le mot de passe";
    else if (newPassword !== confirmNewPassword)
      errors.confirmNewPassword = "Les mots de passe ne correspondent pas";
    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setPasswordErrors({});
    setPasswordLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPasswordSuccess("Mot de passe mis à jour avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setPasswordErrors({ currentPassword: err.response.data.error });
      } else {
        setPasswordErrors({ global: "Une erreur est survenue." });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Mon profil</h2>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Informations personnelles
          </h3>

          {profileErrors.global && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {profileErrors.global}
            </div>
          )}
          {profileSuccess && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {profileErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {profileErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="MonPseudo"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.username ? "border-red-400" : "border-gray-200"}`}
              />
              {profileErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {profileErrors.username}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {profileLoading ? "Enregistrement..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Changer le mot de passe
          </h3>

          {passwordErrors.global && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {passwordErrors.global}
            </div>
          )}
          {passwordSuccess && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.currentPassword ? "border-red-400" : "border-gray-200"}`}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.newPassword ? "border-red-400" : "border-gray-200"}`}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.confirmNewPassword ? "border-red-400" : "border-gray-200"}`}
              />
              {passwordErrors.confirmNewPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.confirmNewPassword}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {passwordLoading ? "Mise à jour..." : "Changer le mot de passe"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Se déconnecter
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
