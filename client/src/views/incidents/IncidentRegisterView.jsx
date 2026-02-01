/**
 * Incident Register View
 * 
 * Form for creating new incidents.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentAPI } from '../../core/services/incident.service';

const IncidentRegisterView = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    registrationStation: '',
    firNumber: '',
    registrationYear: '',
    firFilingDate: '',
    evidenceSeizureDate: '',
    applicableSections: ''
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
      const response = await incidentAPI.create(formData);
      const newIncidentId = response.data.data.incident._id;
      navigate(`/incidents/${newIncidentId}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to register incident');
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
            Register New Incident
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Enter incident details to create a new record in the system.
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
            <label htmlFor="registrationStation" className="form-label">
              Registration Station
            </label>
            <input
              id="registrationStation"
              name="registrationStation"
              type="text"
              required
              value={formData.registrationStation}
              onChange={handleInputChange}
              placeholder="Enter police station name"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firNumber" className="form-label">
                FIR Number
              </label>
              <input
                id="firNumber"
                name="firNumber"
                type="text"
                required
                value={formData.firNumber}
                onChange={handleInputChange}
                placeholder="e.g., 123/2025"
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="registrationYear" className="form-label">
                Registration Year
              </label>
              <input
                id="registrationYear"
                name="registrationYear"
                type="number"
                required
                value={formData.registrationYear}
                onChange={handleInputChange}
                placeholder="YYYY"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firFilingDate" className="form-label">
                FIR Filing Date
              </label>
              <input
                id="firFilingDate"
                name="firFilingDate"
                type="date"
                required
                value={formData.firFilingDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="evidenceSeizureDate" className="form-label">
                Evidence Seizure Date
              </label>
              <input
                id="evidenceSeizureDate"
                name="evidenceSeizureDate"
                type="date"
                required
                value={formData.evidenceSeizureDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="applicableSections" className="form-label">
              Applicable Sections
            </label>
            <input
              id="applicableSections"
              name="applicableSections"
              type="text"
              required
              value={formData.applicableSections}
              onChange={handleInputChange}
              placeholder="e.g., IPC 302, NDPS Act"
              className="form-input"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full action-button action-button--primary py-3 text-base"
            >
              {isSubmitting ? 'Registering...' : 'Register Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentRegisterView;
