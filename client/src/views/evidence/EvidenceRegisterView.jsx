/**
 * Evidence Register View
 * 
 * Form to register new evidence for an incident.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evidenceAPI } from '../../core/services/evidence.service';

const EVIDENCE_CATEGORIES = [
  'ELECTRONICS',
  'DOCUMENTS',
  'WEAPONS',
  'NARCOTICS',
  'CURRENCY',
  'VEHICLE',
  'JEWELLERY',
  'OTHER'
];

const ASSOCIATED_PARTIES = [
  'SUSPECT',
  'VICTIM', 
  'UNIDENTIFIED'
];

const EvidenceRegisterView = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itemDescription: '',
    itemCategory: '',
    associatedParty: '',
    quantity: 1,
    measurementUnit: 'piece',
    rackNumber: '',
    roomNumber: '',
    compartmentId: '',
    remarks: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Build form data for file upload
      const payload = new FormData();
      payload.append('incidentRef', incidentId);
      payload.append('itemDescription', formData.itemDescription);
      payload.append('itemCategory', formData.itemCategory);
      payload.append('associatedParty', formData.associatedParty);
      payload.append('quantity', formData.quantity);
      payload.append('measurementUnit', formData.measurementUnit);
      payload.append('rackNumber', formData.rackNumber);
      payload.append('roomNumber', formData.roomNumber);
      payload.append('compartmentId', formData.compartmentId);
      payload.append('remarks', formData.remarks);
      
      if (formData.image) {
        payload.append('photograph', formData.image);
      }

      await evidenceAPI.register(payload);
      navigate(`/incidents/${incidentId}/evidence`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to register evidence');
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
            Register Evidence
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Document a new evidence item for this incident.
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="itemCategory" className="form-label">
                Category
              </label>
              <select
                id="itemCategory"
                name="itemCategory"
                required
                value={formData.itemCategory}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select category...</option>
                {EVIDENCE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="associatedParty" className="form-label">
                Associated Party
              </label>
              <select
                id="associatedParty"
                name="associatedParty"
                required
                value={formData.associatedParty}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select party...</option>
                {ASSOCIATED_PARTIES.map((party) => (
                  <option key={party} value={party}>
                    {party}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="itemDescription" className="form-label">
              Description
            </label>
            <textarea
              id="itemDescription"
              name="itemDescription"
              required
              rows={3}
              value={formData.itemDescription}
              onChange={handleInputChange}
              placeholder="Describe the evidence item..."
              className="form-input resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="measurementUnit" className="form-label">
                Unit
              </label>
              <input
                id="measurementUnit"
                name="measurementUnit"
                type="text"
                value={formData.measurementUnit}
                onChange={handleInputChange}
                placeholder="e.g., piece, gram, kg"
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="roomNumber" className="form-label">
                Room Number
              </label>
              <input
                id="roomNumber"
                name="roomNumber"
                type="text"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="e.g., R-01"
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="rackNumber" className="form-label">
                Rack Number
              </label>
              <input
                id="rackNumber"
                name="rackNumber"
                type="text"
                value={formData.rackNumber}
                onChange={handleInputChange}
                placeholder="e.g., A-12"
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="compartmentId" className="form-label">
                Compartment
              </label>
              <input
                id="compartmentId"
                name="compartmentId"
                type="text"
                value={formData.compartmentId}
                onChange={handleInputChange}
                placeholder="e.g., C-03"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="remarks" className="form-label">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={2}
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Any additional notes..."
              className="form-input resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="form-label">Evidence Photograph</label>
            <div 
              className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                         transition-colors ${
                           imagePreview 
                             ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
                             : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                         }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 mx-auto rounded-lg"
                  />
                ) : (
                  <>
                    <svg className="w-10 h-10 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-slate-500 mt-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full action-button action-button--primary py-3 text-base"
            >
              {isSubmitting ? 'Registering...' : 'Register Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvidenceRegisterView;
