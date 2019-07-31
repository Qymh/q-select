module.exports = {
  rootDir: process.cwd(),
  moduleFileExtensions: ['js', 'ts', 'css'],
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.spec.js'],
  collectCoverageFrom: ['packages/@qymh/q-select/src/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(ts)$': '<rootDir>/node_modules/ts-jest'
  },
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/node_modules/jest-css-modules'
  }
};
