/**
 * Incident List View
 * 
 * Displays all incidents with search functionality.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentAPI } from '../../core/services/incident.service';

const IncidentListView = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await incidentAPI.fetchAll();
      setIncidents(response.data.data.incidents || []);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    
    if (!searchTerm.trim()) {
      loadIncidents();
      return;
    }

    setIsLoading(true);
    try {
      const response = await incidentAPI.search(searchTerm);
      setIncidents(response.data.data.incidents || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Incident Registry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage all registered incidents
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incidents..."
              className="form-input pl-10 w-64"
            />
          </div>
          <button type="submit" className="action-button action-button--secondary">
            Search
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="surface-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : incidents.length === 0 ? (
          <div className="empty-state m-6">
            <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">No incidents found</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>FIR Number</th>
                <th>Year</th>
                <th>Station</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident._id}
                  onClick={() => navigate(`/incidents/${incident._id}`)}
                >
                  <td className="font-medium text-slate-900 dark:text-white">
                    {incident.firNumber}
                  </td>
                  <td>{incident.registrationYear}</td>
                  <td>{incident.registrationStation}</td>
                  <td>
                    <span className={`status-badge ${
                      incident.currentStatus === 'CLOSED' 
                        ? 'status-badge--closed' 
                        : 'status-badge--active'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        incident.currentStatus === 'CLOSED' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      {incident.currentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncidentListView;
