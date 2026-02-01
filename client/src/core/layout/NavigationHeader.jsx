/**
 * Navigation Header Component
 * 
 * Top navigation bar with brand, links, and user menu.
 * Different visual design from original.
 */
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../providers/SessionProvider';

const NavigationHeader = () => {
  const { currentUser, signOut } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  // Navigation links configuration
  const navigationLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Incidents', href: '/incidents' },
    { label: 'New Incident', href: '/incidents/register' },
    // Admin-only link
    ...(currentUser?.designation === 'ADMIN' 
      ? [{ label: 'Add Staff', href: '/staff/register' }] 
      : []
    )
  ];

  // Check if link is active (special handling for nested routes)
  const isLinkActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href === '/incidents' && location.pathname.startsWith('/incidents/register')) {
      return false; // Don't highlight "Incidents" when on "New Incident"
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              E
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Evidence<span className="text-emerald-600">Hub</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={`nav-item ${isLinkActive(link.href) ? 'nav-item--active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* User Info - Desktop */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {currentUser?.badgeNumber}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser?.designation}
              </span>
            </div>

            {/* Sign Out - Desktop */}
            <button
              onClick={handleSignOut}
              className="hidden md:block px-4 py-2 text-sm font-medium rounded-lg
                        text-rose-600 dark:text-rose-400 
                        bg-rose-50 dark:bg-rose-900/20
                        hover:bg-rose-100 dark:hover:bg-rose-900/40
                        transition-colors"
            >
              Sign Out
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <nav className="space-y-1">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium
                          text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
