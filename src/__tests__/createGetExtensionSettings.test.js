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

describe('function returned by createGetExtensionConfiguration', function() {
  var createGetExtensionSettings = require('inject-loader!../createGetExtensionSettings')({
    './public/replaceTokens': function(obj) {
      var replacedObj = {};

      // Simulate replacing data element tokens.
      Object.keys(obj).forEach(function(key) {
        replacedObj[key] = obj[key] + ' - replaced';
      });

      return replacedObj;
    }
  });

  it('returns settings with data element tokens replaced', function() {
    var getExtensionSettings = createGetExtensionSettings({
      name: '%foo%'
    });

    expect(getExtensionSettings()).toEqual({
      name: '%foo% - replaced'
    });
  });

  it('gracefully handles undefined settings', function() {
    var getExtensionSettings = createGetExtensionSettings();

    expect(getExtensionSettings()).toEqual({});
  });
});
