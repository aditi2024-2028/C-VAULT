/**
 * Incident Detail View
 * 
 * Shows complete incident information with navigation to related entities.
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { incidentAPI } from '../../core/services/incident.service';
import { closureAPI } from '../../core/services/closure.service';
import { useSession } from '../../core/providers/SessionProvider';

const IncidentDetailView = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSession();
  
  const [incident, setIncident] = useState(null);
  const [closureRecord, setClosureRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIncidentData = async () => {
      try {
        const incidentRes = await incidentAPI.fetchById(incidentId);
        const incidentData = incidentRes.data.data.incident;
        setIncident(incidentData);

        // Load closure record if incident is closed
        if (incidentData.currentStatus === 'CLOSED') {
          try {
            const closureRes = await closureAPI.fetchByIncident(incidentId);
            setClosureRecord(closureRes.data.data.closure);
          } catch {
            // No closure record
          }
        }
      } catch (error) {
        console.error('Failed to load incident:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIncidentData();
  }, [incidentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Incident not found</p>
      </div>
    );
  }

  const isAdmin = currentUser?.designation === 'ADMIN';
  const isClosed = incident.currentStatus === 'CLOSED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/incidents')}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to incidents
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Incident Details
          </h1>
        </div>
        
        <span className={`status-badge ${isClosed ? 'status-badge--closed' : 'status-badge--active'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isClosed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {incident.currentStatus}
        </span>
      </div>

      {/* Main Info Card */}
      <div className="surface-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="data-field">
            <p className="data-label">FIR Number</p>
            <p className="data-value">{incident.firNumber}</p>
          </div>
          
          <div className="data-field">
            <p className="data-label">Registration Year</p>
            <p className="data-value">{incident.registrationYear}</p>
          </div>
          
          <div className="data-field">
            <p className="data-label">Registration Station</p>
            <p className="data-value">{incident.registrationStation}</p>
          </div>
          
          <div className="data-field">
            <p className="data-label">Applicable Sections</p>
            <p className="data-value">{incident.applicableSections}</p>
          </div>
          
          <div className="data-field md:col-span-2">
            <p className="data-label">Assigned Investigator</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                {incident.assignedInvestigator?.name?.charAt(0) || 'N'}
              </div>
              <div>
                <p className="data-value">{incident.assignedInvestigator?.name || 'Not assigned'}</p>
                <p className="text-sm text-slate-500">{incident.assignedInvestigator?.badgeNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closure Information */}
      {isClosed && closureRecord && (
        <div className="surface-card p-6 border-l-4 border-l-emerald-500">
          <h2 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Closure Record
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Disposition Method</p>
              <p className="font-medium text-slate-900 dark:text-white">{closureRecord.dispositionMethod}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Closure Date</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(closureRecord.closureDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Court Order</p>
              <p className="font-medium text-slate-900 dark:text-white">{closureRecord.courtOrderNumber || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Remarks</p>
              <p className="font-medium text-slate-900 dark:text-white">{closureRecord.closureRemarks || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          to={`/incidents/${incidentId}/evidence`}
          className="action-button action-button--primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          View Evidence
        </Link>

        {!isClosed && (
          <Link
            to={`/incidents/${incidentId}/evidence/register`}
            className="action-button action-button--secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Evidence
          </Link>
        )}

        {isAdmin && !isClosed && (
          <Link
            to={`/incidents/${incidentId}/close`}
            className="action-button action-button--danger ml-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Close Incident
          </Link>
        )}
      </div>
    </div>
  );
};

export default IncidentDetailView;
