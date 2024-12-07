module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/test', '<rootDir>/src'], // Include both src and tests directories
  };