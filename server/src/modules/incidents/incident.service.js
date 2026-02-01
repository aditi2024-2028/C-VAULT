/**
 * Incident Service
 * 
 * Business logic for incident/case management.
 * Handles CRUD operations and search functionality.
 */
import { Incident } from './incident.model.js';
import AppError from '../../shared/utils/AppError.js';

class IncidentService {
  /**
   * Creates a new incident record
   */
  async createIncident(incidentData) {
    const incident = await Incident.create(incidentData);
    return incident;
  }

  /**
   * Retrieves all incidents with optional filtering
   */
  async getAllIncidents(filters = {}) {
    const query = {};
    
    if (filters.status) {
      query.currentStatus = filters.status;
    }
    
    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 });
      
    return incidents;
  }

  /**
   * Retrieves single incident by ID
   */
  async getIncidentById(incidentId) {
    const incident = await Incident.findById(incidentId);
    
    if (!incident) {
      throw AppError.notFound('Incident not found');
    }
    
    return incident;
  }

  /**
   * Searches incidents based on various criteria
   */
  async searchIncidents(searchParams) {
    const { status, station, firNumber, year, keyword } = searchParams;
    const query = {};

    if (status) {
      query.currentStatus = status;
    }

    if (station) {
      query.registrationStation = { $regex: station, $options: 'i' };
    }

    if (firNumber) {
      query.firNumber = firNumber;
    }

    if (year) {
      query.registrationYear = parseInt(year, 10);
    }

    // Full-text search across multiple fields
    if (keyword) {
      query.$or = [
        { registrationStation: { $regex: keyword, $options: 'i' } },
        { firNumber: { $regex: keyword, $options: 'i' } },
        { applicableSections: { $regex: keyword, $options: 'i' } }
      ];
    }

    const incidents = await Incident.find(query).sort({ createdAt: -1 });
    return incidents;
  }

  /**
   * Finds incidents pending beyond threshold days
   */
  async getLongPendingIncidents(thresholdDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - thresholdDays);

    const incidents = await Incident.find({
      currentStatus: 'ACTIVE',
      createdAt: { $lte: cutoffDate }
    }).sort({ createdAt: 1 }); // Oldest first

    return incidents;
  }

  /**
   * Gets dashboard metrics summary
   */
  async getDashboardMetrics() {
    const [totalCount, activeCount, closedCount] = await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ currentStatus: 'ACTIVE' }),
      Incident.countDocuments({ currentStatus: 'CLOSED' })
    ]);

    return {
      totalIncidents: totalCount,
      activeIncidents: activeCount,
      closedIncidents: closedCount
    };
  }

  /**
   * Updates incident status to closed
   */
  async closeIncident(incidentId) {
    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      { currentStatus: 'CLOSED' },
      { new: true }
    );

    if (!incident) {
      throw AppError.notFound('Incident not found');
    }

    return incident;
  }
}

export default new IncidentService();
