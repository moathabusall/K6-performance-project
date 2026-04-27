import apiFlow from '../flows/apiFlow.js';
import { smokeThresholds } from '../config/thresholds.js';
import { generateReport } from '../config/report.js';

export const options = {
 thresholds: smokeThresholds,
 scenarios: {
   smoke: {
      executor: 'shared-iterations',
      vus: 5,
      iterations: 25,
      maxDuration: '5m'
   }
 }
};

export default apiFlow;

export function handleSummary(data) {
  return generateReport(data, "smoke");
}