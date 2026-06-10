import http from 'k6/http';
import { check, sleep } from 'k6';

// --- Test Configuration ---
export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '30s', target: 1000 },  // Stay at 1000 users for 30 seconds
    { duration: '10s', target: 0 },   // Ramp down to 0 users over 10 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

export default function () {
  const BASE_URL = 'http://localhost:4000'; 
  
  // Test the database-driven endpoint
  const res = http.get(`${BASE_URL}/api/events`);

  // Validate the response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns an array of events': (r) => {
        try {
            const body = r.json();
            // Depending on how your backend wraps the response, it might be in body.data or just body
            return Array.isArray(body) || (body && body.success && Array.isArray(body.data));
        } catch(e) {
            return false;
        }
    }
  });

  sleep(1); 
}
