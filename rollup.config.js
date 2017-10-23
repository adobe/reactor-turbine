import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/engine.js',
    format: 'iife',
    globals: {
      'window': 'window'
    },
    external: [
      'window'
    ]
  },
  name: '_satellite',
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};
