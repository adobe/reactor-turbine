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

var injectNormalizeSyntheticEvent = require('inject-loader!../normalizeSyntheticEvent');

var mockMeta = {
  $type: 'extension-name.event-name',
  $rule: {
    name: 'rule name'
  }
};

describe('normalizeSyntheticEvent', function() {
  var logger;
  var normalizeSyntheticEvent;

  beforeEach(function() {
    logger = {
      warn: jasmine.createSpy()
    };

    normalizeSyntheticEvent = injectNormalizeSyntheticEvent({
      './logger': logger
    });
  });

  it('creates a synthetic event with meta if synthetic event is undefined', function() {
    var syntheticEvent = normalizeSyntheticEvent(mockMeta);
    expect(syntheticEvent).toEqual({
      $type: 'extension-name.event-name',
      $rule: {
        name: 'rule name'
      }
    });
  });

  // This test exists because issues could occur if we modify the way we normalize
  // events in certain ways that may not be obvious. For example:
  // (1) In the example in this test, if normalizeSyntheticEvent were to use Object.assign to
  // copy properties from the synthetic event to a new object, "detail" would not be copied
  // from the CustomEvent instance. This is because Object.assign only copies
  // "enumerable own properties", or, in other words, properties on the object itself
  // and not its prototype chain. The "detail" property is on the custom event's prototype.
  // (2) If normalizeSyntheticEvent were to create a new object that extends from the
  // synthetic event (using Object.create(syntheticEvent)) and then added the meta onto
  // that new object, user code that currently does something like Object.keys(event) will
  // suddenly start returning only the meta keys ($rule, $type), since Object.keys would
  // not return properties from the prototype.
  // See DTM-14142
  it('modifies the original syntheticEvent rather than creating a new object', function() {
    var syntheticEvent = new CustomEvent('test', { detail: 'foo' });
    var normalizedSyntheticEvent = normalizeSyntheticEvent(mockMeta, syntheticEvent);

    expect(normalizedSyntheticEvent).toBe(syntheticEvent);
    expect(normalizedSyntheticEvent.detail).toBe('foo');
    expect(normalizedSyntheticEvent.$type).toBe('extension-name.event-name');
    expect(normalizedSyntheticEvent.$rule.name).toBe('rule name');
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

    // Note that the type property is non-enumerable, which is why the other tests pass without
    // accounting for the type property.
    expect(syntheticEvent.type).toBe('extension-name.event-name');
    expect(logger.warn).toHaveBeenCalledWith('Accessing event.type in Adobe Launch has been ' +
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
