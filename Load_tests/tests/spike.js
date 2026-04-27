import browseFlow from '../flows/browseFlow.js';
import cartFlow from '../flows/cartFlow.js';
import checkoutFlow from '../flows/checkoutFlow.js';
import { spikeThresholds } from '../config/thresholds.js';
import { generateReport } from '../config/report.js';

export const options = {

 stages: [
   { duration:'1m', target:50 },
   { duration:'30s', target:250 },
   { duration:'30s', target:500 },
   { duration:'2m', target:100 },
   { duration:'1m', target:50 },
   { duration:'30s', target:0 }
 ],

 thresholds: spikeThresholds
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
  return generateReport(data, "spike");
}