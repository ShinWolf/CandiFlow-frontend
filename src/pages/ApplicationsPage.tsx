import { useEffect, useState } from "react";
import { getApplications, deleteApplication } from "../api/applications";
import type { Application, ApplicationPageResponse } from "../types";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationModal from "../components/ApplicationModal";
import Navbar from "../components/Navbar";

const STATUS_OPTIONS = ["", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
const STATUS_LABELS: Record<string, string> = {
  "": "Tous les statuts",
  APPLIED: "Candidaté",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusé",
};

const ApplicationsPage = () => {
  const [data, setData] = useState<ApplicationPageResponse | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [company, setCompany] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const result = await getApplications(
        page,
        10,
        status || undefined,
        search || undefined,
      );
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, status, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    await deleteApplication(id);
    fetchApplications();
  };

  const handleEdit = (app: Application) => {
    setEditTarget(app);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditTarget(null);
    fetchApplications();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Mes candidatures
            </h2>
            {data && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {data.totalElements} candidature
                {data.totalElements > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(company);
                setPage(0);
              }
            }}
            className="flex-1 min-w-48 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center text-gray-400 dark:text-gray-600 py-16">
            Chargement...
          </div>
        ) : data?.content.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              Aucune candidature trouvée.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 text-sm text-green-700 dark:text-green-400 hover:underline"
            >
              Ajouter ta première candidature
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {data?.content.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:border-green-500 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              ← Précédent
            </button>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= data.totalPages}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:border-green-500 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}
      </main>

      {modalOpen && (
        <ApplicationModal onClose={handleModalClose} editTarget={editTarget} />
      )}
    </div>
  );
};

export default ApplicationsPage;
