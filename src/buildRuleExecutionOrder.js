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

/**
 * Rules can be ordered by users at the event type level. For example, assume both Rule A and Rule B
 * use the Library Loaded and Window Loaded event types. Rule A can be ordered to come before Rule B
 * on Library Loaded but after Rule B on Window Loaded.
 *
 * Order values are integers and act more as a priority. In other words, multiple rules can have the
 * same order value. If they have the same order value, their order of execution should be
 * considered nondetermistic.
 *
 * @param {Array} rules
 * @returns {Array} An ordered array of rule-event pair objects.
 */
module.exports = function(rules) {
  var ruleEventPairs = [];

  rules.forEach(function(rule) {
    if (rule.events) {
      rule.events.forEach(function(event) {
        ruleEventPairs.push({
          rule: rule,
          event: event
        });
      });
    }
  });

  return ruleEventPairs.sort(function(ruleEventPairA, ruleEventPairB) {
    return ruleEventPairA.event.ruleOrder - ruleEventPairB.event.ruleOrder;
  });
};
