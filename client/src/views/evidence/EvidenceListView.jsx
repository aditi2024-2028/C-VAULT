/**
 * Evidence List View
 * 
 * Shows all evidence items for a specific incident.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evidenceAPI } from '../../core/services/evidence.service';
import { incidentAPI } from '../../core/services/incident.service';

const EvidenceListView = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [evidenceRes, incidentRes] = await Promise.all([
          evidenceAPI.fetchByIncident(incidentId),
          incidentAPI.fetchById(incidentId)
        ]);
        
        setEvidenceItems(evidenceRes.data.data.evidenceItems || []);
        setIncident(incidentRes.data.data.incident);
      } catch (error) {
        console.error('Failed to load evidence:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [incidentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(`/incidents/${incidentId}`)}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to incident
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Evidence Registry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            FIR: {incident?.firNumber} • {evidenceItems.length} item(s)
          </p>
        </div>

        {incident?.currentStatus !== 'CLOSED' && (
          <Link
            to={`/incidents/${incidentId}/evidence/register`}
            className="action-button action-button--primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Evidence
          </Link>
        )}
      </div>

      {/* Evidence Grid */}
      {evidenceItems.length === 0 ? (
        <div className="empty-state surface-card p-12">
          <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">
            No evidence recorded
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Register evidence items for this incident
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceItems.map((item) => (
            <EvidenceCard
              key={item._id}
              evidence={item}
              incidentId={incidentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Evidence Card Component
 */
const EvidenceCard = ({ evidence, incidentId }) => {
  const categoryIcons = {
    'ELECTRONICS': '📱',
    'DOCUMENTS': '📄',
    'WEAPONS': '🗡️',
    'NARCOTICS': '💊',
    'CURRENCY': '💵',
    'VEHICLE': '🚗',
    'JEWELLERY': '💎',
    'OTHER': '📦'
  };

  return (
    <Link
      to={`/incidents/${incidentId}/evidence/${evidence._id}`}
      className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 
                hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 
                       flex items-center justify-center text-2xl flex-shrink-0">
          {categoryIcons[evidence.itemCategory] || '📦'}
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 dark:text-white truncate">
            {evidence.itemDescription}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {evidence.itemCategory}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Qty: {evidence.itemQuantity?.amount || 1} {evidence.itemQuantity?.measurementUnit || ''}
            </span>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {evidence.photographUrl && (
        <div className="mt-4">
          <img
            src={evidence.photographUrl}
            alt={evidence.itemDescription}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
    </Link>
  );
};

export default EvidenceListView;
