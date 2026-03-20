import { useState } from "react";
import type { Application, ApplicationRequest } from "../types";
import { createApplication, updateApplication } from "../api/applications";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      if (editTarget) {
        await updateApplication(editTarget.id, form);
      } else {
        await createApplication(form);
      }
      onClose();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
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
      newErrors.notes = "Les notes ne peuvent pas dépasser 500 caractères";
    return newErrors;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {editTarget ? "Modifier la candidature" : "Ajouter une candidature"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poste
              </label>
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="appliedAt"
                value={form.appliedAt}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.appliedAt && (
                <p className="text-red-500 text-xs mt-1">{errors.appliedAt}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien vers l'offre
            </label>
            <input
              name="offerUrl"
              value={form.offerUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.offerUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.offerUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Notes personnelles..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
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
