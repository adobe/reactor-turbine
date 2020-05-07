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
var lastPromiseInQueue = Promise.resolve();

module.exports = function (
  addConditionToQueue,
  addActionToQueue,
  logRuleCompleted
) {
  return function (rule, syntheticEvent) {
    if (rule.conditions) {
      rule.conditions.forEach(function (condition) {
        lastPromiseInQueue = addConditionToQueue(
          condition,
          rule,
          syntheticEvent,
          lastPromiseInQueue
        );
      });
    }

    if (rule.actions) {
      rule.actions.forEach(function (action) {
        lastPromiseInQueue = addActionToQueue(
          action,
          rule,
          syntheticEvent,
          lastPromiseInQueue
        );
      });
    }

    lastPromiseInQueue = lastPromiseInQueue.then(function () {
      logRuleCompleted(rule);
    });

    // Allows later rules to keep running when an error occurs within this rule.
    lastPromiseInQueue = lastPromiseInQueue.catch(function () {});

    return lastPromiseInQueue;
  };
};
