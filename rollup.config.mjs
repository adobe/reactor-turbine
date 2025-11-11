/***************************************************************************************
 * (c) 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import stripCode from 'rollup-plugin-strip-code';

// The stripCode will strip all code wrapped in START.TESTS_ONLY/END.TESTS_ONLY
// comments when process.env.NODE_ENV = production (like in package.json build:production).

/* eslint-disable camelcase */
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
    ...('production' === process.env.NODE_ENV
      ? [stripCode({
        start_comment: 'START.TESTS_ONLY',
        end_comment: 'END.TESTS_ONLY'
      })]
      : []),
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};
