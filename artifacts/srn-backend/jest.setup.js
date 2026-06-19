require('dotenv').config({ path: '.env.test' });
// Fallback to .env if .env.test doesn't have everything or doesn't exist
require('dotenv').config();

// Increase test timeout to handle slow OTP emails
jest.setTimeout(30000);

// Silence logger output during unit tests
jest.mock('./src/utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock nodemailer to prevent slow HTTP requests to ethereal.email
jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({
    user: 'test-user',
    pass: 'test-pass',
  }),
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'mocked-message-id',
    }),
  }),
  getTestMessageUrl: jest.fn().mockReturnValue('https://ethereal.email/mock-message'),
}));
