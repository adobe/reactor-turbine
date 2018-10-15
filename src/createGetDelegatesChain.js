/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var Promise = require('@adobe/reactor-promise');

module.exports = function(runModule) {
  return function(
    components,
    rule,
    syntheticEvent,
    logError,
    resultThenFn,
    errorsBreakChain
  ) {
    return components.reduceRight(
      function(next, component) {
        return function() {
          try {
            var result = Promise.resolve(
              runModule(component, syntheticEvent, [syntheticEvent])
            );

            if (resultThenFn) {
              result = Promise.resolve(result).then(function(result) {
                return resultThenFn(component, result);
              });
            }

            return Promise.race([
              result,
              new Promise(function(resolve) {
                var timeout = 5000;
                setTimeout(resolve, timeout);
              }),
            ])
              .then(next)
              .catch(function(e) {
                // Condition not met errors are logged upper in the chain.
                // We don't want to log them as errors.
                // You might get to this point without having an error object
                // if there is a promise rejected without any reason (eg. `reject()`);
                if (!e || e.message !== 'condition not met') {
                  logError(component, rule, e || new Error('Unknown error'));
                }
                throw e;
              });
          } catch (e) {
            logError(component, rule, e);
            if (errorsBreakChain === true) {
              throw e;
            } else {
              return Promise.resolve(next());
            }
          }
        };
      },
      function() {}
    );
  };
};
