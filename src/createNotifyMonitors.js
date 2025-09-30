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

function injectCreateNotifyMonitors({ logger }) {
  return function createNotifyMonitors(satellite) {
    var warningLogged = false;

    return function notifyMonitors(type, event) {
      var monitors = satellite._monitors;

      if (monitors) {
        if (!warningLogged) {
          logger.warn(
            'The _satellite._monitors API may change at any time and should only ' +
              'be used for debugging.'
          );
          warningLogged = true;
        }

        monitors.forEach(function (monitor) {
          if (monitor[type]) {
            monitor[type](event);
          }
        });
      }
    };
  };
}

var logger = require('./logger');
module.exports = injectCreateNotifyMonitors({ logger });

// For testing only
module.exports.injectCreateNotifyMonitors = injectCreateNotifyMonitors;
