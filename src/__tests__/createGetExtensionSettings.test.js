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

'use strict';
var createGetExtensionSettings = require('../createGetExtensionSettings');

describe('function returned by createGetExtensionConfiguration', function() {
  var settingsWithReplacements = {
    name: 'shoes'
  };

  var replaceTokens = function() {
    return settingsWithReplacements;
  };

  it('returns settings with data element tokens replaced', function() {
    var getExtensionSettings = createGetExtensionSettings(replaceTokens, {
      name: '%foo%'
    });

    expect(getExtensionSettings()).toEqual(settingsWithReplacements);
  });

  it('gracefully handles undefined settings', function() {
    var getExtensionSettings = createGetExtensionSettings(replaceTokens);

    expect(getExtensionSettings()).toEqual({});
  });
});
