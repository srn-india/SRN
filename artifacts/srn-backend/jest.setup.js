require('dotenv').config({ path: '.env.test' });
// Fallback to .env if .env.test doesn't have everything or doesn't exist
require('dotenv').config();

// Increase test timeout to handle slow OTP emails
jest.setTimeout(30000);
