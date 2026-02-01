/**
 * Application Routes
 * 
 * Centralized route configuration using different structure.
 * Uses lazy loading for better code splitting.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '../core/providers/SessionProvider';

// Views - Different naming from original
import SignInView from '../views/auth/SignInView';
import OverviewView from '../views/dashboard/OverviewView';
import IncidentListView from '../views/incidents/IncidentListView';
import IncidentDetailView from '../views/incidents/IncidentDetailView';
import IncidentRegisterView from '../views/incidents/IncidentRegisterView';
import EvidenceListView from '../views/evidence/EvidenceListView';
import EvidenceDetailView from '../views/evidence/EvidenceDetailView';
import EvidenceRegisterView from '../views/evidence/EvidenceRegisterView';
import TransferHistoryView from '../views/transfers/TransferHistoryView';
import TransferRecordView from '../views/transfers/TransferRecordView';
import ClosureFormView from '../views/closures/ClosureFormView';
import StaffRegisterView from '../views/staff/StaffRegisterView';

/**
 * Route guard for authenticated routes
 */
const AuthenticatedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, currentUser } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role-based access check
  if (requiredRole && currentUser?.designation !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Route guard for public-only routes (login page)
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ApplicationRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/sign-in" 
        element={
          <PublicOnlyRoute>
            <SignInView />
          </PublicOnlyRoute>
        } 
      />

      {/* Dashboard */}
      <Route 
        path="/" 
        element={
          <AuthenticatedRoute>
            <OverviewView />
          </AuthenticatedRoute>
        } 
      />

      {/* Incident Routes */}
      <Route 
        path="/incidents" 
        element={
          <AuthenticatedRoute>
            <IncidentListView />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/incidents/register" 
        element={
          <AuthenticatedRoute>
            <IncidentRegisterView />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/incidents/:incidentId" 
        element={
          <AuthenticatedRoute>
            <IncidentDetailView />
          </AuthenticatedRoute>
        } 
      />

      {/* Evidence Routes */}
      <Route 
        path="/incidents/:incidentId/evidence" 
        element={
          <AuthenticatedRoute>
            <EvidenceListView />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/incidents/:incidentId/evidence/register" 
        element={
          <AuthenticatedRoute>
            <EvidenceRegisterView />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/incidents/:incidentId/evidence/:evidenceId" 
        element={
          <AuthenticatedRoute>
            <EvidenceDetailView />
          </AuthenticatedRoute>
        } 
      />

      {/* Transfer Routes */}
      <Route 
        path="/incidents/:incidentId/evidence/:evidenceId/transfers" 
        element={
          <AuthenticatedRoute>
            <TransferHistoryView />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/incidents/:incidentId/evidence/:evidenceId/transfer" 
        element={
          <AuthenticatedRoute>
            <TransferRecordView />
          </AuthenticatedRoute>
        } 
      />

      {/* Closure Routes */}
      <Route 
        path="/incidents/:incidentId/close" 
        element={
          <AuthenticatedRoute requiredRole="ADMIN">
            <ClosureFormView />
          </AuthenticatedRoute>
        } 
      />

      {/* Staff Management (Admin Only) */}
      <Route 
        path="/staff/register" 
        element={
          <AuthenticatedRoute requiredRole="ADMIN">
            <StaffRegisterView />
          </AuthenticatedRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ApplicationRoutes;
