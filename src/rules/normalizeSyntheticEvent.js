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

function injectNormalizeSyntheticEvent({
  objectAssign,
  isPlainObject,
  logger
}) {
  return function normalizeSyntheticEvent(syntheticEventMeta, syntheticEvent) {
    syntheticEvent = syntheticEvent || {};
    if (isPlainObject(syntheticEvent)) {
      syntheticEvent = objectAssign({}, syntheticEvent, syntheticEventMeta);
    } else {
      objectAssign(syntheticEvent, syntheticEventMeta);
    }
    if (!syntheticEvent.hasOwnProperty('type')) {
      Object.defineProperty(syntheticEvent, 'type', {
        get: function () {
          logger.deprecation(
            'Accessing event.type in Adobe Launch has been deprecated and will be ' +
              'removed soon. Please use event.$type instead.'
          );
          return syntheticEvent.$type;
        }
      });
    }
    return syntheticEvent;
  };
}

var objectAssign = require('@adobe/reactor-object-assign');
var { isPlainObject } = require('is-plain-object');
var logger = require('../logger');
module.exports = injectNormalizeSyntheticEvent({
  objectAssign,
  isPlainObject,
  logger
});
// For testing only.
module.exports.injectNormalizeSyntheticEvent = injectNormalizeSyntheticEvent;
