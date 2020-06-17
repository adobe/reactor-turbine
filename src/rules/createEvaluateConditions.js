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

module.exports = function (
  executeDelegateModule,
  isConditionMet,
  logConditionNotMet,
  logConditionError
) {
  return function (rule, syntheticEvent) {
    var condition;

    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        condition = rule.conditions[i];

        try {
          var result = executeDelegateModule(condition, syntheticEvent, [
            syntheticEvent
          ]);

          // If the result is promise-like, the extension needs to do something asynchronously,
          // but the customer does not have rule component sequencing enabled on the property.
          // If we didn't do this, the condition would always pass because the promise is
          // considered "truthy".
          if (typeof result === 'object' && typeof result.then === 'function') {
            throw new Error(
              'Rule component sequencing must be enabled on the property ' +
                'for this condition to function properly.'
            );
          }

          if (!isConditionMet(condition, result)) {
            logConditionNotMet(condition, rule);
            return false;
          }
        } catch (e) {
          logConditionError(condition, rule, e);
          return false;
        }
      }
    }

    return true;
  };
};
