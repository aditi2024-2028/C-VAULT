/**
 * Closure Service
 * 
 * Business logic for case closure/disposal.
 */
import { CaseClosure } from './closure.model.js';
import incidentService from '../incidents/incident.service.js';
import AppError from '../../shared/utils/AppError.js';

class ClosureService {
  /**
   * Records case closure and updates incident status
   */
  async closeCase(closureData) {
    const closure = await CaseClosure.create(closureData);
    
    // Update incident status
    await incidentService.closeIncident(closureData.incidentRef);
    
    return closure;
  }

  /**
   * Gets closure record for an incident
   */
  async getClosureByIncident(incidentId) {
    const closure = await CaseClosure.findOne({ incidentRef: incidentId });
    return closure;
  }
}

export default new ClosureService();
