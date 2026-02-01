/**
 * Transfer Record View
 * 
 * Form to record a new custody transfer.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { transferAPI } from '../../core/services/transfer.service';

const TRANSFER_PURPOSES = [
  'STORAGE',
  'COURT_PRODUCTION',
  'FORENSIC_LAB',
  'EXAMINATION',
  'RELOCATION'
];

const TransferRecordView = () => {
  const { incidentId, evidenceId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    transferPurpose: '',
    sourceLocation: '',
    destinationLocation: '',
    notes: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await transferAPI.record({
        evidenceRef: evidenceId,
        ...formData
      });
      
      navigate(`/incidents/${incidentId}/evidence/${evidenceId}/transfers`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to record transfer');
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
            Record Transfer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Document a custody transfer for this evidence item.
          </p>
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
            <label htmlFor="transferPurpose" className="form-label">
              Transfer Purpose
            </label>
            <select
              id="transferPurpose"
              name="transferPurpose"
              required
              value={formData.transferPurpose}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select purpose...</option>
              {TRANSFER_PURPOSES.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sourceLocation" className="form-label">
              Source Location
            </label>
            <input
              id="sourceLocation"
              name="sourceLocation"
              type="text"
              value={formData.sourceLocation}
              onChange={handleInputChange}
              placeholder="Current location of the evidence"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="destinationLocation" className="form-label">
              Destination Location
            </label>
            <input
              id="destinationLocation"
              name="destinationLocation"
              type="text"
              required
              value={formData.destinationLocation}
              onChange={handleInputChange}
              placeholder="Where the evidence is being transferred to"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes about this transfer..."
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
              className="flex-1 action-button action-button--primary py-3"
            >
              {isSubmitting ? 'Recording...' : 'Record Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferRecordView;
