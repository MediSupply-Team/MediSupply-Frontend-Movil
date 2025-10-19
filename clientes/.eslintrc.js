module.exports = {
  extends: ['expo', '@expo/eslint-config'],
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
  rules: {
    // Puedes agregar reglas personalizadas aquí si es necesario
    'import/no-unresolved': 'error',
  },
};