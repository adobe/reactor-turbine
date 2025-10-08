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

module.exports.bareBonesContainer = function () {
  return cloneDeep({
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
      }
    }
  });
};

/* eslint-disable no-unused-vars */

// event - on dom click
// condition - always true
// action - sets window[customActionWindowVariable] to the resolved data element value of 'data:element:value'
module.exports.simpleEventConditionActionContainer = function ({
  ruleComponentSequencingEnabled = false,
  customActionWindowVariable
}) {
  // this is where the action places the output when it runs
  if (!customActionWindowVariable) {
    throw new Error('actionWindowVariable is required');
  }

  return cloneDeep({
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
          ruleComponentSequencingEnabled
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
                  // console.log('returning a true value');
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
                  // in playwright, you can't use node closure variables during runtime,
                  // so we have to serialize them into the settings block so they aren't undefined.
                  window[settings.customActionWindowVariable] =
                    `integration-test-module:sequencingEnabled-${settings.ruleComponentSequencingEnabled}:${turbine.getDataElementValue(settings.dataElementNameToGrab)}`;
                };
              }
            },
            'integration-test-module/src/lib/events/simpleEventTrigger.js': {
              name: 'simple-event-trigger',
              displayName: 'Simple Event Trigger',
              // integration-test-module/src/lib/events/simpleEventTrigger.js
              script: function (module, exports, require, turbine) {
                var document = require('@adobe/reactor-document');
                // console.log('evaluating simple event code');
                module.exports = function (settings, trigger) {
                  function addClickListener() {
                    document.body.addEventListener('click', function () {
                      // console.log('firing trigger from simple event');
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
                dataElementNameToGrab: 'core data element',
                customActionWindowVariable,
                ruleComponentSequencingEnabled
              },
              timeout: 2000,
              delayNext: true
            }
          ]
        }
      ]
    }
  });
};
