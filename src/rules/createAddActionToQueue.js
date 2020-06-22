/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

var Promise = require('@adobe/reactor-promise');

module.exports = function (
  executeDelegateModule,
  normalizeRuleComponentError,
  logActionError
) {
  return function (action, rule, syntheticEvent, lastPromiseInQueue) {
    return lastPromiseInQueue.then(function () {
      // This module is used when ruleComponentSequencing is enabled.
      // action.timeout is always supplied to this module as >= 0 when delayNext is true.

      var delayNextAction = action.delayNext;
      var actionTimeoutId;

      return new Promise(function (resolve, reject) {
        var moduleResult = executeDelegateModule(action, syntheticEvent, [
          syntheticEvent
        ]);

        if (!delayNextAction) {
          return resolve();
        }

        var promiseTimeoutMs = action.timeout;
        var timeoutPromise = new Promise(function (resolve, reject) {
          actionTimeoutId = setTimeout(function () {
            reject(
              new Error(
                'A timeout occurred because the action took longer than ' +
                  promiseTimeoutMs / 1000 +
                  ' seconds to complete. '
              )
            );
          }, promiseTimeoutMs);
        });

        Promise.race([moduleResult, timeoutPromise]).then(resolve, reject);
      })
        .catch(function (e) {
          clearTimeout(actionTimeoutId);
          e = normalizeRuleComponentError(e);
          logActionError(action, rule, e);
          return Promise.reject(e);
        })
        .then(function () {
          clearTimeout(actionTimeoutId);
        });
    });
  };
};
