/**
 * Overview View (Dashboard)
 * 
 * Main dashboard with metrics and analytics.
 * Different layout and visual approach.
 */
import { useState, useEffect } from 'react';
import { incidentAPI } from '../../core/services/incident.service';
import { reportAPI } from '../../core/services/report.service';
import { useSession } from '../../core/providers/SessionProvider';

const OverviewView = () => {
  const { currentUser } = useSession();
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metricsRes, alertsRes] = await Promise.all([
          incidentAPI.fetchMetrics(),
          incidentAPI.fetchPendingAlerts()
        ]);
        
        setMetrics(metricsRes.data.data.metrics);
        setPendingAlerts(alertsRes.data.data.incidents || []);

        // Analytics only for admin
        if (currentUser?.designation === 'ADMIN') {
          const analyticsRes = await reportAPI.fetchOverview();
          setAnalytics(analyticsRes.data.data.report);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          System Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, {currentUser?.fullName || currentUser?.badgeNumber}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Incidents"
          value={metrics?.totalIncidents || 0}
          description="Registered in system"
          accentColor="emerald"
        />
        <MetricCard
          label="Active Incidents"
          value={metrics?.activeIncidents || 0}
          description="Awaiting closure"
          accentColor="amber"
        />
        <MetricCard
          label="Closed Incidents"
          value={metrics?.closedIncidents || 0}
          description="Successfully resolved"
          accentColor="teal"
        />
      </div>

      {/* Pending Alerts Section */}
      {pendingAlerts.length > 0 && (
        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Long Pending Incidents
          </h2>
          <div className="space-y-3">
            {pendingAlerts.slice(0, 5).map((incident) => (
              <div 
                key={incident._id}
                className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    FIR: {incident.firNumber}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {incident.registrationStation}
                  </p>
                </div>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {Math.floor((Date.now() - new Date(incident.createdAt)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Analytics Section - Admin Only */}
      {analytics && (
        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Analytics Insights
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Trends */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Registration Trends
              </h3>
              <div className="space-y-3">
                {analytics.incidentsTimeline?.slice(-6).map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400 w-20">
                      {item._id}
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                        style={{ width: `${Math.min(item.count * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 w-8">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Distribution */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Evidence Categories
              </h3>
              <div className="space-y-2">
                {analytics.evidenceDistribution?.slice(0, 5).map((item, idx) => (
                  <div 
                    key={item._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item._id}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

/**
 * Metric Card Component
 */
const MetricCard = ({ label, value, description, accentColor }) => {
  const gradients = {
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-500',
    teal: 'from-teal-500 to-cyan-600'
  };

  return (
    <div className="metric-card">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
        {label}
      </p>
      <p className={`text-4xl font-bold bg-gradient-to-br ${gradients[accentColor]} bg-clip-text text-transparent`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        {description}
      </p>
    </div>
  );
};

export default OverviewView;
