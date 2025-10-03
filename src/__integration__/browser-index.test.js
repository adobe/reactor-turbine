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

const cloneDeep = require('lodash.clonedeep');

/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

const testContainer = {
  container: {
    buildInfo: {
      turbineVersion: '1.0.0-testing'
    },
    company: {
      dynamicCdnEnabled: false,
      cdnAllowList: []
    },
    property: {
      settings: {
        undefinedVarsReturnEmpty: false,
        ruleComponentSequencingEnabled: true
      }
    },
    environment: {
      stage: 'development'
    },
    dataElements: {
      'core data element': {
        modulePath: 'core/src/lib/dataElements/constant.js',
        settings: {
          value: 'data:element:value'
        }
      }
    },
    extensions: {
      core: {
        displayName: 'Core',
        hostedLibFilesBaseUrl: 'http://fakewebsite.localhost',
        modules: {
          'core/src/lib/condition/alwaysTrue.js': {
            name: 'always-true',
            displayName: 'Always True',
            script: function (module, exports, require, turbine) {
              module.exports = function (settings) {
                // who cares? just return true.
                return true;
              };
            }
          },
          'core/src/lib/dataElements/constant.js': {
            name: 'constant',
            displayName: 'Constant',
            script: function (module, exports, require, turbine) {
              module.exports = function (settings) {
                return settings.value;
              };
            }
          }
        }
      },
      'integration-test-extension': {
        displayName: 'Integration Test Extension',
        hostedLibFilesBaseUrl: 'http://fakewebsite.localhost',
        modules: {
          'integration-test-module/src/lib/actions/customActionSource.js': {
            name: 'custom-action-source',
            displayName: 'Custom Action Source',
            script: function (module, exports, require, turbine) {
              var window = require('@adobe/reactor-window');
              module.exports = function (settings) {
                window.customActionSourceValue = `integration-test-module:${turbine.getDataElementValue(settings.dataElementNameToGrab)}`;
              };
            }
          },
          'integration-test-module/src/lib/events/simpleEventTrigger.js': {
            name: 'simple-event-trigger',
            displayName: 'Simple Event Trigger',
            // integration-test-module/src/lib/events/simpleEventTrigger.js
            script: function (module, exports, require, turbine) {
              var document = require('@adobe/reactor-document');
              module.exports = function (settings, trigger) {
                function addClickListener() {
                  document.body.addEventListener('click', function () {
                    trigger();
                  });
                }

                if (
                  document.readyState === 'complete' ||
                  document.readyState === 'interactive'
                ) {
                  addClickListener();
                } else {
                  document.addEventListener(
                    'DOMContentLoaded',
                    addClickListener
                  );
                }
              };
            }
          }
        }
      }
    },
    rules: [
      {
        id: 'RL123456',
        name: 'Invoke Custom Action Source',
        events: [
          {
            modulePath:
              'integration-test-module/src/lib/events/simpleEventTrigger.js',
            settings: {},
            ruleOrder: 50
          }
        ],
        conditions: [
          {
            modulePath: 'core/src/lib/condition/alwaysTrue.js',
            settings: {},
            timeout: 2000
          }
        ],
        actions: [
          {
            modulePath:
              'integration-test-module/src/lib/actions/customActionSource.js',
            settings: {
              dataElementNameToGrab: 'core data element'
            },
            timeout: 2000,
            delayNext: true
          }
        ]
      }
    ]
  }
};

describe('Integration: dist/engine.js', () => {
  let initialSatelliteReference;
  beforeAll((done) => {
    // Simulate a container being present before index.js is imported
    window._satellite = cloneDeep(testContainer);
    initialSatelliteReference = window._satellite;

    expect(Boolean(window.__satelliteLoaded)).toBeFalse();
    const script = document.createElement('script');
    script.src = '/base/dist/engine.js'; // '/base/' is Karma's base URL prefix
    script.onload = () => {
      expect(Boolean(window.__satelliteLoaded)).toBeTrue();
      done();
    };
    script.onerror = (e) => done.fail(`Failed to load engine.js: ${e.message}`);
    document.body.appendChild(script);
  });

  beforeEach(() => {
    delete window.customActionSourceValue;
  });

  it('window._satellite should be decorated without the reference changing', async () => {
    expect(window._satellite).toBe(initialSatelliteReference);
  });

  it('should have expected _satellite functions', async () => {
    expect(window._satellite)
      .withContext('Expected window._satellite to be defined.')
      .toBeDefined();
    expect(window._satellite.property)
      .withContext('Expected window._satellite.property to be defined.')
      .toBeDefined();
    expect(window._satellite.buildInfo)
      .withContext('Expected window._satellite.buildInfo to be defined.')
      .toBeDefined();
    expect(window._satellite.environment)
      .withContext('Expected window._satellite.environment to be defined.')
      .toBeDefined();
    expect(window._satellite.cookie)
      .withContext('Expected window._satellite.cookie to be defined.')
      .toBeDefined();
    expect(window._satellite.logger)
      .withContext('Expected window._satellite.logger to be defined.')
      .toBeDefined();
    expect(window._satellite.logger.log)
      .withContext('Expected window._satellite.logger.log to be defined.')
      .toBeDefined();
    expect(window._satellite.logger.info)
      .withContext('Expected window._satellite.logger.info to be defined.')
      .toBeDefined();
    expect(window._satellite.logger.debug)
      .withContext('Expected window._satellite.logger.debug to be defined.')
      .toBeDefined();
    expect(window._satellite.logger.warn)
      .withContext('Expected window._satellite.logger.warn to be defined.')
      .toBeDefined();
    expect(window._satellite.logger.error)
      .withContext('Expected window._satellite.logger.error to be defined.')
      .toBeDefined();
    expect(window._satellite.readCookie)
      .withContext('Expected window._satellite.readCookie to be defined.')
      .toBeDefined();
    expect(window._satellite.removeCookie)
      .withContext('Expected window._satellite.removeCookie to be defined.')
      .toBeDefined();
    expect(window._satellite.setCookie)
      .withContext('Expected window._satellite.setCookie to be defined.')
      .toBeDefined();
    expect(window._satellite.pageBottom)
      .withContext('Expected window._satellite.pageBottom to be defined.')
      .toBeDefined();
    expect(window._satellite.notify)
      .withContext('Expected window._satellite.notify to be defined.')
      .toBeDefined();
    expect(window._satellite.getVisitorId)
      .withContext('Expected window._satellite.getVisitorId to be defined.')
      .toBeDefined();
    expect(window._satellite.track)
      .withContext('Expected window._satellite.track to be defined.')
      .toBeDefined();
    expect(window._satellite.setVar)
      .withContext('Expected window._satellite.setVar to be defined.')
      .toBeDefined();
    expect(window._satellite.getVar)
      .withContext('Expected window._satellite.getVar to be defined.')
      .toBeDefined();
    expect(window._satellite.setDebug)
      .withContext('Expected window._satellite.setDebug to be defined.')
      .toBeDefined();
  });

  it('Can call setVar and getVar', () => {
    expect(window._satellite.setVar('testVar')).toBeFalsy();
    window._satellite.setVar('testVar', 123);
    expect(window._satellite.getVar('testVar')).toBe(123);
  });

  it('should have the proper shape for _satellite.environment', async () => {
    expect(window._satellite.environment).toEqual({ stage: 'development' });
  });

  it('should have the proper shape for _satellite.buildInfo', async () => {
    expect(window._satellite.buildInfo).toEqual({
      turbineVersion: '1.0.0-testing'
    });
  });

  it('tests a basic event/condition/action loop works', (done) => {
    /*
     * integration-test-module/src/lib/events/simpleEventTrigger.js adds a click listener to document.body.
     * if core/src/lib/condition/alwaysTrue.js fails in some way
     * or integration-test-module/src/lib/actions/customActionSource.js doesn't run and set window.customActionSourceValue
     * then this test will time out.
     */
    expect(window.customActionSourceValue).toBeFalsy();

    let internalValue;

    Object.defineProperty(window, 'customActionSourceValue', {
      configurable: true,
      enumerable: true,
      get() {
        return internalValue;
      },
      set(value) {
        internalValue = value;
        if (value === 'integration-test-module:data:element:value') {
          done();
        }
      }
    });

    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);
  });
});
