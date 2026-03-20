import type { Application } from "../types";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300",
  INTERVIEW: "bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300",
  OFFER:
    "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300",
  REJECTED: "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Candidaté",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusé",
};

interface Props {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
}

const ApplicationCard = ({ application, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 truncate">
            {application.company}
          </h3>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[application.status]}`}
          >
            {STATUS_LABELS[application.status]}
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 truncate">
          {application.jobTitle}
        </p>
        {application.notes && (
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1 truncate">
            {application.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs text-gray-300 dark:text-gray-600 mr-2">
          {application.appliedAt}
        </span>

        {application.offerUrl && (
          <a
            href={application.offerUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Voir l'offre"
          >
            <ExternalLink size={14} />
          </a>
        )}

        <button
          onClick={() => onEdit(application)}
          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Modifier"
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={() => onDelete(application.id)}
          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
