module.exports = {
  extends: ['eslint:recommended', 'plugin:compat/recommended'],
  globals: {
    Set: 'readonly',
    Map: 'readonly',
  },
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {},
  settings: {
    polyfills: [
      'Set',
      'Map',
      'fetch',
      'Object.assign',
      'requestAnimationFrame',
      'performance.now',
    ],
  },
};
