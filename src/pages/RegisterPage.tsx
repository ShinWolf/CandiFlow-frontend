import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../api/auth";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasEmoji = (str: string) => /\p{Extended_Pictographic}/u.test(str);
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "L'email est obligatoire";
    else if (!emailRegex.test(email))
      newErrors.email = "L'email n'est pas valide";
    if (!username) newErrors.username = "Le pseudo est obligatoire";
    else if (username.length < 3 || username.length > 30)
      newErrors.username = "Entre 3 et 30 caractères";
    else if (hasEmoji(username))
      newErrors.username = "Les emojis ne sont pas autorisés";
    if (!password) newErrors.password = "Le mot de passe est obligatoire";
    else if (password.length < 8) newErrors.password = "Au moins 8 caractères";
    if (!confirmPassword)
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await registerApi({ email, password, username });
      navigate("/login");
    } catch (err: any) {
      if (err.response?.status === 409) {
        const msg = err.response.data.error;
        if (msg.includes("Email"))
          setErrors({ email: "Cet email est déjà utilisé" });
        else setErrors({ username: "Ce pseudo est déjà utilisé" });
      } else {
        setGlobalError("Une erreur est survenue, réessaie plus tard.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors ${errors[field] ? "border-red-400 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-200">
      <button
        onClick={toggle}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-green-500 transition-colors"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-green-700 dark:text-green-400">
            CandiFlow
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Suis tes candidatures simplement
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
            Créer un compte
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
            Commence à suivre tes candidatures
          </p>

          {globalError && (
            <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100 dark:border-red-900">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="MonPseudo"
                className={inputClass("username")}
              />
              {errors.username && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass("password")}
              />
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-400 dark:text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-green-700 dark:text-green-400 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
