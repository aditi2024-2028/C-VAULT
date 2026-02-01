/**
 * Staff Register View
 * 
 * Form to register new staff members (Admin only).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffAPI } from '../../core/services/staff.service';

const DESIGNATIONS = [
  'OFFICER',
  'ADMIN'
];

const StaffRegisterView = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    badgeNumber: '',
    password: '',
    passwordConfirm: '',
    designation: 'OFFICER',
    stationAssignment: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await staffAPI.createStaff({
        fullName: formData.fullName,
        badgeNumber: formData.badgeNumber,
        password: formData.password,
        designation: formData.designation,
        stationAssignment: formData.stationAssignment
      });
      
      setSuccessMessage(`Staff member ${formData.badgeNumber} registered successfully!`);
      setFormData({
        fullName: '',
        badgeNumber: '',
        password: '',
        passwordConfirm: '',
        designation: 'OFFICER',
        stationAssignment: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to register staff member');
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
            Register Staff Member
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Create a new account for a staff member to access the system.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert--success mb-6">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

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
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="badgeNumber" className="form-label">
                Badge Number
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                required
                value={formData.badgeNumber}
                onChange={handleInputChange}
                placeholder="Unique badge ID"
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="designation" className="form-label">
                Designation
              </label>
              <select
                id="designation"
                name="designation"
                required
                value={formData.designation}
                onChange={handleInputChange}
                className="form-input"
              >
                {DESIGNATIONS.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="stationAssignment" className="form-label">
              Station Assignment
            </label>
            <input
              id="stationAssignment"
              name="stationAssignment"
              type="text"
              required
              value={formData.stationAssignment}
              onChange={handleInputChange}
              placeholder="e.g., Central Police Station"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 characters"
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="form-label">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                className="form-input"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 action-button action-button--secondary py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 action-button action-button--primary py-3"
            >
              {isSubmitting ? 'Registering...' : 'Register Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffRegisterView;
