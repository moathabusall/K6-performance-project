import browseFlow from '../flows/browseFlow.js';
import cartFlow from '../flows/cartFlow.js';
import checkoutFlow from '../flows/checkoutFlow.js';
import { soakThresholds } from '../config/thresholds.js';
import { generateReport } from '../config/report.js';

export const options = {

 vus:50,
 duration:'5m',

 thresholds: soakThresholds
};


export default function(){

 let flow=Math.random();

 if(flow<0.5){
   browseFlow();
 }
 else if(flow<0.8){
   cartFlow();
 }
 else{
   checkoutFlow();
 }

}

export function handleSummary(data) {
  return generateReport(data, "soak");
}