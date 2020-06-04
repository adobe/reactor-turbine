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
  isConditionMet,
  logConditionError,
  logConditionNotMet
) {
  return function (condition, rule, syntheticEvent, lastPromiseInQueue) {
    return lastPromiseInQueue.then(function () {
      var timeoutId;

      return new Promise(function (resolve, reject) {
        var promiseTimeout = condition.timeout;

        timeoutId = setTimeout(function () {
          // Reject instead of resolve to prevent subsequent
          // conditions and actions from executing.
          reject(
            new Error(
              'A timeout occurred because the condition took longer than ' +
                (promiseTimeout || 0) / 1000 +
                ' seconds to complete. '
            )
          );
        }, promiseTimeout);

        Promise.resolve(
          executeDelegateModule(condition, 'conditions', syntheticEvent, [
            syntheticEvent
          ])
        ).then(resolve, reject);
      })
        .catch(function (e) {
          clearTimeout(timeoutId);
          e = normalizeRuleComponentError(e);
          logConditionError(condition, rule, e);
          return Promise.reject(e);
        })
        .then(function (result) {
          clearTimeout(timeoutId);
          if (!isConditionMet(condition, result)) {
            logConditionNotMet(condition, rule);
            return Promise.reject();
          }
        });
    });
  };
};
