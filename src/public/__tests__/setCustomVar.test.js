/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

describe('setCustomVar', function() {
  var customVars;
  var setCustomVar;

  beforeEach(function() {
    customVars = {};
    setCustomVar = require('inject-loader!../setCustomVar')({
      '../state': {
        customVars: customVars
      }
    });
  });

  it('sets a single custom var', function() {
    setCustomVar('foo', 'bar');

    expect(customVars['foo']).toBe('bar');
  });

  it('sets multiple custom vars', function() {
    setCustomVar({
      foo: 'bar',
      animal: 'unicorn'
    });

    expect(customVars['foo']).toBe('bar');
    expect(customVars['animal']).toBe('unicorn');
  });
});
