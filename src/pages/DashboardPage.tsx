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
import Navbar from "../components/Navbar";

const STATUS_COLORS = {
  light: {
    APPLIED: "#3B6D11",
    INTERVIEW: "#b45309",
    OFFER: "#065f46",
    REJECTED: "#dc2626",
  },
  dark: {
    APPLIED: "#97C459",
    INTERVIEW: "#fbbf24",
    OFFER: "#6ee7b7",
    REJECTED: "#f87171",
  },
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
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 transition-colors">
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">{label}</p>
    <p className={`text-3xl font-semibold ${color}`}>{value}</p>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  const colors = isDark ? STATUS_COLORS.dark : STATUS_COLORS.light;

  const chartData = stats
    ? [
        { name: "Candidaté", value: stats.applied, color: colors.APPLIED },
        { name: "Entretien", value: stats.interview, color: colors.INTERVIEW },
        { name: "Offre", value: stats.offer, color: colors.OFFER },
        { name: "Refusé", value: stats.rejected, color: colors.REJECTED },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Dashboard
        </h2>

        {loading ? (
          <div className="text-center text-gray-400 dark:text-gray-600 py-16">
            Chargement...
          </div>
        ) : stats ? (
          <>
            {/* Cartes stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total"
                value={stats.total}
                color="text-gray-800 dark:text-gray-100"
              />
              <StatCard
                label="Entretiens"
                value={`${stats.interviewRate}%`}
                color="text-amber-600 dark:text-amber-400"
              />
              <StatCard
                label="Offres"
                value={`${stats.offerRate}%`}
                color="text-emerald-600 dark:text-emerald-400"
              />
              <StatCard
                label="Refusés"
                value={stats.rejected}
                color="text-red-500 dark:text-red-400"
              />
            </div>

            {/* Graphique */}
            {chartData.length > 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 transition-colors">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
                  Répartition par statut
                </h3>
                <ResponsiveContainer width="100%" height={280}>
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
                      contentStyle={{
                        background: isDark ? "#111827" : "#fff",
                        border: `1px solid ${isDark ? "#1f2937" : "#f3f4f6"}`,
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: isDark ? "#f9fafb" : "#111827",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span
                          style={{
                            fontSize: "13px",
                            color: isDark ? "#9ca3af" : "#6b7280",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-8 text-center transition-colors">
                <p className="text-gray-400 dark:text-gray-600 text-sm">
                  Aucune donnée à afficher. Ajoute des candidatures !
                </p>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default DashboardPage;
