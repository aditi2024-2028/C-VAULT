/**
 * Reports Service
 * 
 * Analytics and reporting functionality.
 */
import { Incident } from '../incidents/incident.model.js';
import { EvidenceItem } from '../evidence/evidence.model.js';

class ReportService {
  /**
   * Generates comprehensive analytics overview
   */
  async generateOverviewReport() {
    // Incidents per month
    const incidentsTimeline = await Incident.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Closures per month
    const closuresTimeline = await Incident.aggregate([
      { $match: { currentStatus: 'CLOSED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$updatedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Evidence by category
    const evidenceDistribution = await EvidenceItem.aggregate([
      {
        $group: {
          _id: '$itemCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Workload by officer
    const officerWorkload = await Incident.aggregate([
      {
        $group: {
          _id: '$assignedInvestigator.badgeNumber',
          officerName: { $first: '$assignedInvestigator.name' },
          caseCount: { $sum: 1 }
        }
      },
      { $sort: { caseCount: -1 } },
      { $limit: 10 }
    ]);

    return {
      incidentsTimeline,
      closuresTimeline,
      evidenceDistribution,
      officerWorkload
    };
  }
}

export default new ReportService();
