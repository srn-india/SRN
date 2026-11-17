/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetModules: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+/node_modules/.+\\.js$': ['ts-jest', { tsconfig: { allowJs: true } }],
  },
  // pnpm nests dependencies under .pnpm before their own node_modules directory.
  transformIgnorePatterns: [
    '/node_modules/(?!\\.pnpm/|sanitize-html/|htmlparser2/|domhandler/|domelementtype/|domutils/|dom-serializer/|entities/)',
    '/node_modules/\\.pnpm/(?!(sanitize-html|htmlparser2|domhandler|domelementtype|domutils|dom-serializer|entities)@)',
  ],
};
