module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/backend/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/backend/tests/testEnv.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/index.js',
    '!backend/seeder.js',
    '!backend/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};
