import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApplications, deleteApplication } from "../api/applications";
import type { Application, ApplicationPageResponse } from "../types";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationModal from "../components/ApplicationModal";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const STATUS_OPTIONS = ["", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

const STATUS_LABELS: Record<string, string> = {
  "": "Tous",
  APPLIED: "Candidaté",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusé",
};

const ApplicationsPage = () => {
  const { logout } = useAuth();

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Titre + bouton ajouter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Mes candidatures
            </h2>
            {data && (
              <p className="text-sm text-gray-500 mt-1">
                {data.totalElements} candidature
                {data.totalElements > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
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
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-48"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <p className="text-center text-gray-400 py-12">Chargement...</p>
        ) : data?.content.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Aucune candidature trouvée.
          </p>
        ) : (
          <div className="space-y-3">
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
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">
              {page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= data.totalPages}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Suivant
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <ApplicationModal onClose={handleModalClose} editTarget={editTarget} />
      )}
    </div>
  );
};

export default ApplicationsPage;
