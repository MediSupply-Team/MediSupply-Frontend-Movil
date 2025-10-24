/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Transforma paquetes de RN y Expo dentro de node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(?:jest-)?react-native' +
      '|@react-native' +
      '|react-clone-referenced-element' +
      '|@react-native-community' +
      '|expo(nent)?' +
      '|@expo(nent)?/.*' +
      '|expo-asset' +
      '|expo-constants' +
      '|expo-file-system' +
      '|expo-font' +
      '|expo-keep-awake' +
      '|expo-linear-gradient' +
      '|expo-linking' +
      '|expo-modules-core' +
      '|expo-web-browser' +
      ')',
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  resolver: 'react-native/jest/resolver',
  // === Cobertura ===
  collectCoverage: true,
  collectCoverageFrom: [
    // típicos paths en Expo + expo-router
    'app/**/*.{js,jsx,ts,tsx}',
    // 'src/**/*.{js,jsx,ts,tsx}',
    // excluye archivos que no tiene sentido medir
    '!**/__tests__/**',
    '!**/*.d.ts',
    '!**/jest.config.*',
    '!**/jest.setup.*',
  ],
  coverageReporters: ['text', 'lcov', 'html'], // 'text' para consola, 'lcov' para Codecov, 'html' para navegar
  coverageDirectory: '<rootDir>/coverage',

  // (opcional) umbrales mínimos para “aprobar” CI
  // súbelos cuando ya tengas más tests
  coverageThreshold: {
    global: {
      lines: 10,
      statements: 10,
      branches: 0,
      functions: 5,
    },
  },
};