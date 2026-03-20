import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getStats, type DashboardStats } from "../api/dashboard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const COLORS = {
  APPLIED: "#3b82f6",
  INTERVIEW: "#f59e0b",
  OFFER: "#22c55e",
  REJECTED: "#ef4444",
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const DashboardPage = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats
    ? [
        { name: "Candidaté", value: stats.applied, color: COLORS.APPLIED },
        { name: "Entretien", value: stats.interview, color: COLORS.INTERVIEW },
        { name: "Offre", value: stats.offer, color: COLORS.OFFER },
        { name: "Refusé", value: stats.rejected, color: COLORS.REJECTED },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        {loading ? (
          <p className="text-center text-gray-400 py-12">Chargement...</p>
        ) : stats ? (
          <>
            {/* Cartes stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total"
                value={stats.total}
                color="text-gray-800"
              />
              <StatCard
                label="Entretiens"
                value={`${stats.interviewRate}%`}
                color="text-yellow-500"
              />
              <StatCard
                label="Offres"
                value={`${stats.offerRate}%`}
                color="text-green-500"
              />
              <StatCard
                label="Refusés"
                value={stats.rejected}
                color="text-red-500"
              />
            </div>

            {/* Graphique */}
            {chartData.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-4">
                  Répartition par statut
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} candidature(s)`, ""]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400">
                Aucune donnée à afficher. Ajoute des candidatures !
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default DashboardPage;
