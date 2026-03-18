import type { Application } from "../types";

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-yellow-100 text-yellow-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
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
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold text-gray-800 truncate">
            {application.company}
          </h3>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[application.status]}`}
          >
            {STATUS_LABELS[application.status]}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">{application.jobTitle}</p>
        {application.notes && (
          <p className="text-xs text-gray-400 mt-1 truncate">
            {application.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-400">{application.appliedAt}</span>
        {application.offerUrl && (
          <a
            href={application.offerUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            Offre
          </a>
        )}
        <button
          onClick={() => onEdit(application)}
          className="text-xs text-gray-500 hover:text-blue-600 transition px-2 py-1 rounded hover:bg-gray-100"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(application.id)}
          className="text-xs text-gray-500 hover:text-red-500 transition px-2 py-1 rounded hover:bg-gray-100"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
