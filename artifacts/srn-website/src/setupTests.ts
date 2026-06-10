import '@testing-library/jest-dom';

// Polyfills or global mocks if needed (like structuredClone or ResizeObserver)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
