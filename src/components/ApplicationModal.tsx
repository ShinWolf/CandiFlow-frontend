import { useState } from "react";
import type { Application, ApplicationRequest } from "../types";
import { createApplication, updateApplication } from "../api/applications";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Candidaté",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusé",
};

interface Props {
  onClose: () => void;
  editTarget: Application | null;
}

const ApplicationModal = ({ onClose, editTarget }: Props) => {
  const [form, setForm] = useState<ApplicationRequest>({
    company: editTarget?.company ?? "",
    jobTitle: editTarget?.jobTitle ?? "",
    status: editTarget?.status ?? "APPLIED",
    notes: editTarget?.notes ?? "",
    offerUrl: editTarget?.offerUrl ?? "",
    appliedAt: editTarget?.appliedAt ?? new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors ${errors[field] ? "border-red-400 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.company.trim())
      newErrors.company = "L'entreprise est obligatoire";
    if (!form.jobTitle.trim()) newErrors.jobTitle = "Le poste est obligatoire";
    if (!form.status) newErrors.status = "Le statut est obligatoire";
    if (!form.appliedAt) newErrors.appliedAt = "La date est obligatoire";
    if (form.offerUrl && !/^https?:\/\/.+/.test(form.offerUrl))
      newErrors.offerUrl = "L'URL doit commencer par http:// ou https://";
    if (form.notes && form.notes.length > 500)
      newErrors.notes = "Maximum 500 caractères";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (editTarget) await updateApplication(editTarget.id, form);
      else await createApplication(form);
      onClose();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-gray-800 dark:text-gray-100">
            {editTarget ? "Modifier la candidature" : "Ajouter une candidature"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Entreprise
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className={inputClass("company")}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Poste
              </label>
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                className={inputClass("jobTitle")}
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Statut
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass("status")}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="appliedAt"
                value={form.appliedAt}
                onChange={handleChange}
                className={inputClass("appliedAt")}
              />
              {errors.appliedAt && (
                <p className="text-red-500 text-xs mt-1">{errors.appliedAt}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Lien vers l'offre
            </label>
            <input
              name="offerUrl"
              value={form.offerUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass("offerUrl")}
            />
            {errors.offerUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.offerUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Notes personnelles..."
              className={`${inputClass("notes")} resize-none`}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading
                ? "Enregistrement..."
                : editTarget
                  ? "Modifier"
                  : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
