import { useEffect, useState } from "react";
import { getProfile, updateProfile, updatePassword } from "../api/user";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const { setProfile: setAuthProfile } = useAuth();

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

  const inputClass = (field: string, errors: Record<string, string>) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors ${errors[field] ? "border-red-400 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`;

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-400 transition-colors">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          Mon profil
        </h2>

        {/* Infos personnelles */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-4 transition-colors">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-5">
            Informations personnelles
          </h3>

          {profileErrors.global && (
            <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100 dark:border-red-900">
              {profileErrors.global}
            </div>
          )}
          {profileSuccess && (
            <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-lg mb-4 border border-green-100 dark:border-green-900">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass("email", profileErrors)}
              />
              {profileErrors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {profileErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="MonPseudo"
                className={inputClass("username", profileErrors)}
              />
              {profileErrors.username && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {profileErrors.username}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {profileLoading ? "Enregistrement..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        </div>

        {/* Mot de passe */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 transition-colors">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-5">
            Changer le mot de passe
          </h3>

          {passwordErrors.global && (
            <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100 dark:border-red-900">
              {passwordErrors.global}
            </div>
          )}
          {passwordSuccess && (
            <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-lg mb-4 border border-green-100 dark:border-green-900">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass("currentPassword", passwordErrors)}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass("newPassword", passwordErrors)}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass("confirmNewPassword", passwordErrors)}
              />
              {passwordErrors.confirmNewPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {passwordErrors.confirmNewPassword}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {passwordLoading ? "Mise à jour..." : "Changer le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
