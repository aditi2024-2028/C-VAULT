/**
 * Sign In View
 * 
 * Authentication page with completely different design.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../core/providers/SessionProvider';

const SignInView = () => {
  const { signIn, error, clearError } = useSession();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    badgeNumber: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await signIn(formData);
    
    if (result.success) {
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Sign In Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              E
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-2">
              Sign in to Evidence Management Portal
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert--error mb-6">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label htmlFor="badgeNumber" className="block text-sm font-medium text-slate-300 mb-2">
                Badge Number
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                required
                value={formData.badgeNumber}
                onChange={handleInputChange}
                placeholder="Enter your badge number"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 
                          text-white placeholder-slate-500 
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                          transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 
                          text-white placeholder-slate-500 
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                          transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-emerald-500 to-teal-600
                        hover:from-emerald-600 hover:to-teal-700
                        focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-500">
            Authorized personnel only • Secure connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
