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

var normalizeSyntheticEvent = require('../normalizeSyntheticEvent');

var mockMeta = {
  $type: 'extension-name.event-name',
  $rule: {
    name: 'rule name'
  }
};

describe('normalizeSyntheticEvent', function() {
  it('creates a synthetic event with meta if synthetic event is undefined', function() {
    var syntheticEvent = normalizeSyntheticEvent(mockMeta);
    expect(syntheticEvent).toEqual({
      $type: 'extension-name.event-name',
      $rule: {
        name: 'rule name'
      }
    });
  });

  it('overwrites meta even if same properties are provided by extension', function() {
    var syntheticEvent = normalizeSyntheticEvent(mockMeta, {
      $type: 'oh nos',
      $rule: 'oh nos'
    });

    expect(syntheticEvent).toEqual({
      $type: 'extension-name.event-name',
      $rule: {
        name: 'rule name'
      }
    });
  });

  it('sets a deprecated type property for backward compatibility', function() {
    var syntheticEvent = normalizeSyntheticEvent(mockMeta);

    spyOn(console, 'warn');
    // Note that the type property is non-enumerable, which is why the other tests pass without
    // accounting for the type property.
    expect(syntheticEvent.type).toBe('extension-name.event-name');
    expect(console.warn).toHaveBeenCalledWith('Accessing event.type in Adobe Launch has been ' +
      'deprecated and will be removed soon. Please use event.$type instead.');
  });

  it('does not overwrite existing type property with deprecated type property', function() {
    var syntheticEvent = normalizeSyntheticEvent(mockMeta, {
      type: 'don\'t overwrite me'
    });

    expect(syntheticEvent).toEqual({
      type: 'don\'t overwrite me',
      $type: 'extension-name.event-name',
      $rule: {
        name: 'rule name'
      }
    });
  });
});
