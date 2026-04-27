import browseFlow from '../flows/browseFlow.js';
import cartFlow from '../flows/cartFlow.js';
import checkoutFlow from '../flows/checkoutFlow.js';
import { stressThresholds } from '../config/thresholds.js';
import { generateReport } from '../config/report.js';

export const options = {

  stages: [
    { duration:'2m', target:50 },
    { duration:'3m', target:100 },
    { duration:'3m', target:200 },
    { duration:'3m', target:300 },
    { duration:'3m', target:400 },
    { duration:'2m', target:500 },
    { duration:'3m', target:0 }
  ],

  thresholds: stressThresholds
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
  return generateReport(data, "stress");
}