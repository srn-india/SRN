import http from 'k6/http';
import { check, sleep } from 'k6';

// --- Test Configuration ---
export const options = {
  // Define stages for ramping up and down the virtual users (VUs)
  stages: [
    { duration: '10s', target: 1000 }, // Ramp up to 1000 users over 10 seconds
    { duration: '30s', target: 1000 },  // Stay at 1000 users for 30 seconds
    { duration: '10s', target: 0 },  // Ramp down to 0 users over 10 seconds
  ],
  // Define thresholds for acceptable performance
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

// --- User Behavior ---
// This default function represents what a single Virtual User (VU) does continuously during the test
export default function () {
  // Make sure this matches your local backend URL and port
  const BASE_URL = 'http://localhost:3000'; 
  
  // 1. Send a GET request to the basic health check endpoint
  const res = http.get(`${BASE_URL}/`);

  // 2. Validate the response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns success': (r) => {
        try {
            return r.json('success') === true;
        } catch(e) {
            return false;
        }
    }
  });

  // 3. Simulate user "think time" (wait 1 second before making the next request)
  sleep(1); 
}
