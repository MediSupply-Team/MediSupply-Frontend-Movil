// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    settings: {
      'import/resolver': {
        'babel-module': {
          root: ['./'],
          alias: {
            '@': './',
            '@/types': './types',
            '@/hooks': './hooks',
            '@/services': './services',
            '@/config': './config',
            '@/components': './components',
            '@/constants': './constants'
          },
        },
      },
    },
  },
]);
