export const smokeThresholds = {
  http_req_failed: [
    'rate<0.05'
  ],

  http_req_duration: [
    'p(95)<1500'
  ],

  iteration_failure: [
    'rate==0'
  ]
};


export const loadThresholds = {
  http_req_failed: [
    'rate<0.05'
  ],

  http_req_duration: [
    'p(95)<5000',
    'p(99)<7000'
  ]
};


export const stressThresholds = {
  http_req_failed: [
    'rate<0.10'
  ],

  http_req_duration: [
    'p(95)<7000',
    'p(99)<10000'
  ]
};


export const spikeThresholds = {
  http_req_failed: [
    'rate<0.15'
  ],

  http_req_duration: [
    'p(95)<8000',
    'p(99)<12000'
  ]
};


export const soakThresholds = {
  http_req_failed: [
    'rate<0.03'
  ],

  http_req_duration: [
    'p(95)<4000',
    'p(99)<6000'
  ]
};