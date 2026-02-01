/**
 * Evidence Detail View
 * 
 * Shows detailed information about a specific evidence item.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evidenceAPI } from '../../core/services/evidence.service';

const EvidenceDetailView = () => {
  const { incidentId, evidenceId } = useParams();
  const navigate = useNavigate();
  
  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        const response = await evidenceAPI.fetchById(evidenceId);
        setEvidence(response.data.data.evidenceItem);
      } catch (error) {
        console.error('Failed to load evidence:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvidence();
  }, [evidenceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Evidence not found</p>
      </div>
    );
  }

  // Format storage location
  const storageLocation = evidence.storageDetails 
    ? `Room ${evidence.storageDetails.roomNumber || '-'}, Rack ${evidence.storageDetails.rackNumber || '-'}`
    : 'Not specified';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate(`/incidents/${incidentId}/evidence`)}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to evidence list
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Evidence Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Item Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="data-field">
                <p className="data-label">Category</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {evidence.itemCategory}
                </span>
              </div>
              
              <div className="data-field">
                <p className="data-label">Quantity</p>
                <p className="data-value">
                  {evidence.itemQuantity?.amount || 1} {evidence.itemQuantity?.measurementUnit || 'piece'}
                </p>
              </div>
              
              <div className="data-field col-span-2">
                <p className="data-label">Description</p>
                <p className="data-value">{evidence.itemDescription}</p>
              </div>
              
              <div className="data-field">
                <p className="data-label">Storage Location</p>
                <p className="data-value">{storageLocation}</p>
              </div>
              
              <div className="data-field">
                <p className="data-label">Associated Party</p>
                <p className="data-value">{evidence.associatedParty || 'Unknown'}</p>
              </div>
              
              {evidence.remarks && (
                <div className="data-field col-span-2">
                  <p className="data-label">Remarks</p>
                  <p className="data-value">{evidence.remarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          {evidence.trackingQrCode && (
            <div className="surface-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Identification QR Code
              </h2>
              <div className="flex items-center justify-center">
                <img
                  src={evidence.trackingQrCode}
                  alt="QR Code"
                  className="w-48 h-48 rounded-xl border-2 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Image and Actions */}
        <div className="space-y-6">
          {evidence.photographUrl && (
            <div className="surface-card p-4">
              <img
                src={evidence.photographUrl}
                alt={evidence.itemDescription}
                className="w-full rounded-xl"
              />
            </div>
          )}

          {/* Actions */}
          <div className="surface-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Actions
            </h3>
            
            <Link
              to={`/incidents/${incidentId}/evidence/${evidenceId}/transfers`}
              className="w-full action-button action-button--secondary text-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              View Custody Chain
            </Link>

            <Link
              to={`/incidents/${incidentId}/evidence/${evidenceId}/transfer`}
              className="w-full action-button action-button--primary text-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Record Transfer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDetailView;
