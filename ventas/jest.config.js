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
};