import uiFlow from '../flows/uiFlow.js';
import { generateReport } from '../config/report.js';

export const options = {
 scenarios:{
   ui_smoke:{
     executor:'shared-iterations',
     vus:2,
     iterations:4,
     options:{
       browser:{
         type:'chromium'
       }
     }
   }
 }
};

export default uiFlow;

export function handleSummary(data) {
  return generateReport(data, "ui");
}