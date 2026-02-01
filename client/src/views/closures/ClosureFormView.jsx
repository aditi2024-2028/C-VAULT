/**
 * Closure Form View
 * 
 * Form to close/dispose an incident (Admin only).
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { closureAPI } from '../../core/services/closure.service';
import { incidentAPI } from '../../core/services/incident.service';

const DISPOSITION_METHODS = [
  'RETURNED_TO_OWNER',
  'DESTROYED',
  'SOLD_AT_AUCTION',
  'COURT_RETENTION'
];

const ClosureFormView = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState(null);
  const [formData, setFormData] = useState({
    dispositionMethod: '',
    courtOrderNumber: '',
    closureDate: new Date().toISOString().split('T')[0],
    closureRemarks: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadIncident = async () => {
      try {
        const response = await incidentAPI.fetchById(incidentId);
        setIncident(response.data.data.incident);
      } catch (error) {
        console.error('Failed to load incident:', error);
      }
    };

    loadIncident();
  }, [incidentId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await closureAPI.recordClosure({
        incidentRef: incidentId,
        ...formData
      });
      
      navigate(`/incidents/${incidentId}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to close incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="surface-card p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Close Incident
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Record closure details for FIR: {incident?.firNumber}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-400">
                This action is irreversible
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                Closing an incident will finalize all evidence records and prevent further modifications.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert--error mb-6">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="dispositionMethod" className="form-label">
              Disposition Method
            </label>
            <select
              id="dispositionMethod"
              name="dispositionMethod"
              required
              value={formData.dispositionMethod}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select disposition method...</option>
              {DISPOSITION_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="courtOrderNumber" className="form-label">
              Court Order Number (Optional)
            </label>
            <input
              id="courtOrderNumber"
              name="courtOrderNumber"
              type="text"
              value={formData.courtOrderNumber}
              onChange={handleInputChange}
              placeholder="If applicable, enter court order reference"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="closureDate" className="form-label">
              Closure Date
            </label>
            <input
              id="closureDate"
              name="closureDate"
              type="date"
              required
              value={formData.closureDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="closureRemarks" className="form-label">
              Remarks
            </label>
            <textarea
              id="closureRemarks"
              name="closureRemarks"
              rows={4}
              value={formData.closureRemarks}
              onChange={handleInputChange}
              placeholder="Any additional information about the closure..."
              className="form-input resize-none"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 action-button action-button--secondary py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 action-button action-button--danger py-3"
            >
              {isSubmitting ? 'Closing...' : 'Close Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClosureFormView;
