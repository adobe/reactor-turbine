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
      var timeoutId;

      return new Promise(function (resolve, reject) {
        var promiseTimeout = action.settings.timeout;

        var moduleResult = executeDelegateModule(action, syntheticEvent, [
          syntheticEvent
        ]);

        if (promiseTimeout) {
          timeoutId = setTimeout(function () {
            reject(
              new Error(
                'A timeout occurred because the action took longer than ' +
                  promiseTimeout / 1000 +
                  ' seconds to complete. '
              )
            );
          }, promiseTimeout);
        } else {
          moduleResult = null;
        }

        Promise.resolve(moduleResult).then(resolve, reject);
      })
        .catch(function (e) {
          clearTimeout(timeoutId);
          e = normalizeRuleComponentError(e);
          logActionError(action, rule, e);
          return Promise.reject(e);
        })
        .then(function () {
          clearTimeout(timeoutId);
        });
    });
  };
};
