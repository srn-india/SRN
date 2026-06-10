import http from 'k6/http';
import { check, sleep } from 'k6';

// --- Test Configuration ---
export const options = {
  stages: [
    { duration: '10s', target: 20 },  // Ramp up to 20 users
    { duration: '30s', target: 50 },  // Stay at 50 users for 30 seconds
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1000ms (writes take longer)
    http_req_failed: ['rate<0.05'],   // Error rate should be less than 5%
  },
};

export default function () {
  const BASE_URL = 'http://localhost:4000'; 
  
  // Generate a random email so we don't hit "User already exists" errors
  const randomEmail = `testuser_${__VU}_${__ITER}_${Math.random().toString(36).substring(7)}@example.com`;

  const payload = JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: randomEmail,
    password: 'Password123!',
    phone: '1234567890',
    state: 'Kerala',
    district: 'Trivandrum',
    gender: 'Male',
    dateOfBirth: '1990-01-01'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Test the write-heavy Registration endpoint
  const res = http.post(`${BASE_URL}/api/auth/register`, payload, params);

  // Verification
  const success = check(res, {
    'status is 201': (r) => r.status === 201,
  });

  if (!success) {
    console.log(`Failed with status ${res.status}: ${res.body}`);
  }

  // Small sleep to emulate real-world user wait time
  sleep(1);
}
