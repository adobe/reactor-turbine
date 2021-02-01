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

var logger = require('../logger');
var objectAssign = require('@adobe/reactor-object-assign');

/**
 * Normalizes a synthetic event so that it exists and has at least meta.
 * @param {Object} syntheticEventMeta
 * @param {Object} [syntheticEvent]
 * @returns {Object}
 */
module.exports = function (syntheticEventMeta, syntheticEvent) {
  syntheticEvent = syntheticEvent || {};
  objectAssign(syntheticEvent, syntheticEventMeta);

  // Remove after some arbitrary time period when we think users have had sufficient chance
  // to move away from event.type
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
