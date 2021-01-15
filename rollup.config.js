import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    intro: "if (!window.atob) { console.warn('Adobe Launch is unsupported in IE 9 and below.'); return; }",
    file: 'dist/engine.js',
    format: 'iife',
    name: '_satellite'
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};
