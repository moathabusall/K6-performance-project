import browseFlow from '../flows/browseFlow.js';
import cartFlow from '../flows/cartFlow.js';
import checkoutFlow from '../flows/checkoutFlow.js';
import { loadThresholds } from '../config/thresholds.js';
import { generateReport } from '../config/report.js';

export const options = {
  scenarios: {

    browse_users: {
      executor: 'constant-arrival-rate',
      exec: 'browseUsers',

      rate: 4,
      timeUnit: '1s',
      duration: '5m',

      preAllocatedVUs: 20,
      maxVUs: 40
    },

    cart_users: {
      executor: 'constant-arrival-rate',
      exec: 'cartUsers',

      rate: 2,
      timeUnit: '1s',
      duration: '5m',

      preAllocatedVUs: 10,
      maxVUs: 20
    },

    buyers: {
      executor: 'constant-arrival-rate',
      exec: 'checkoutUsers',

      rate: 1,
      timeUnit: '1s',
      duration: '5m',

      preAllocatedVUs: 5,
      maxVUs: 10
    }

  },

  thresholds: loadThresholds
};

export function browseUsers() {
  browseFlow();
}

export function cartUsers() {
  cartFlow();
}

export function checkoutUsers() {
  checkoutFlow();
}

export function handleSummary(data) {
  return generateReport(data, "load");
}