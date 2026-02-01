/**
 * Root Application Component
 * 
 * Composes the main layout and routing structure.
 * Uses a different architectural approach with shell pattern.
 */
import { useSession } from './core/providers/SessionProvider';
import AppShell from './core/layout/AppShell';
import ApplicationRoutes from './routes';
import SplashScreen from './core/components/SplashScreen';

const Application = () => {
  const { isInitializing } = useSession();

  // Show loading state while checking authentication
  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <AppShell>
      <ApplicationRoutes />
    </AppShell>
  );
};

export default Application;
