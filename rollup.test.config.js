var nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
var commonjs = require('@rollup/plugin-commonjs');
var eslint = require('@rollup/plugin-eslint');

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/engine.js',
    format: 'iife',
    name: '_satellite'
  },
  plugins: [
    eslint({
      throwOnError: true
    }),
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};
