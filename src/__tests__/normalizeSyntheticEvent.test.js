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

var MOCK_TYPE = 'extension-name.event-name';

describe('normalizeSyntheticEvent', function() {
  it('creates a synthetic event with defaults if synthetic event is undefined', function() {
    var syntheticEvent = normalizeSyntheticEvent(MOCK_TYPE);
    expect(syntheticEvent).toEqual({
      type: MOCK_TYPE,
      element: window,
      target: window
    });
  });

  it('element and targetElement are derived from nativeEvent if nativeEvent exists', function() {
    var nativeEvent = {
      currentTarget: {},
      target: {}
    };

    var syntheticEvent = normalizeSyntheticEvent(MOCK_TYPE, {
      nativeEvent: nativeEvent
    });

    expect(syntheticEvent).toEqual({
      type: MOCK_TYPE,
      element: nativeEvent.currentTarget,
      target: nativeEvent.target,
      nativeEvent: nativeEvent
    });
  });

  it('overwrites type even if provided', function() {
    var syntheticEvent = normalizeSyntheticEvent(MOCK_TYPE, {
      type: 'oh nos'
    });

    expect(syntheticEvent.type).toBe(MOCK_TYPE);
  });

  it('does not overwrite element or target if set', function() {
    var element = {};
    var target = {};

    var syntheticEvent = normalizeSyntheticEvent(MOCK_TYPE, {
      element: element,
      target: target
    });

    expect(syntheticEvent.element).toBe(element);
    expect(syntheticEvent.target).toBe(target);
  });
});
