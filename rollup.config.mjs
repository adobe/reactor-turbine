import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.js',
  output: {
    intro:
      "if (!window.atob) { console.warn('Adobe Launch is unsupported in IE 9 and below.'); return; }",
    file: 'dist/engine.js',
    format: 'iife',
    name: '_satellite'
  },
  plugins: [
    replace({
      preventAssignment: true,
      REACTOR_KARMA_CI_UNIT_TEST_MODE: JSON.stringify(false)
    }),
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};
