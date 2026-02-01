/**
 * Application Shell
 * 
 * Provides the main layout structure with navigation.
 * Only renders navbar for authenticated users.
 */
import { useSession } from '../providers/SessionProvider';
import NavigationHeader from './NavigationHeader';

const AppShell = ({ children }) => {
  const { isAuthenticated } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Only show navigation when authenticated */}
      {isAuthenticated && <NavigationHeader />}
      
      {/* Main content area with responsive padding */}
      <main className={`flex-1 ${isAuthenticated ? 'pt-4 pb-8' : ''}`}>
        {isAuthenticated ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default AppShell;
