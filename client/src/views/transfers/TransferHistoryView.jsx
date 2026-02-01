/**
 * Transfer History View
 * 
 * Displays custody chain / transfer history for an evidence item.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { transferAPI } from '../../core/services/transfer.service';
import { evidenceAPI } from '../../core/services/evidence.service';

const TransferHistoryView = () => {
  const { incidentId, evidenceId } = useParams();
  const navigate = useNavigate();
  
  const [transfers, setTransfers] = useState([]);
  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transfersRes, evidenceRes] = await Promise.all([
          transferAPI.fetchHistory(evidenceId),
          evidenceAPI.fetchById(evidenceId)
        ]);
        
        setTransfers(transfersRes.data.data.transfers || []);
        setEvidence(evidenceRes.data.data.evidenceItem);
      } catch (error) {
        console.error('Failed to load transfer history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [evidenceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(`/incidents/${incidentId}/evidence/${evidenceId}`)}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to evidence
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Custody Chain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {evidence?.itemDescription}
          </p>
        </div>

        <Link
          to={`/incidents/${incidentId}/evidence/${evidenceId}/transfer`}
          className="action-button action-button--primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Transfer
        </Link>
      </div>

      {/* Timeline */}
      {transfers.length === 0 ? (
        <div className="empty-state surface-card p-12">
          <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">
            No transfers recorded
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Evidence has remained at original location
          </p>
        </div>
      ) : (
        <div className="surface-card p-6">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {transfers.map((transfer, index) => (
                <div key={transfer._id} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${index === 0 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {transfer.transferPurpose?.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          To: {transfer.destinationLocation}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {new Date(transfer.transferTimestamp).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {transfer.notes && (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">
                        {transfer.notes}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Released by: {transfer.releasingOfficer?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferHistoryView;
