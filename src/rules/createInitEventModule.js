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
  triggerRule,
  executeDelegateModule,
  normalizeSyntheticEvent,
  getErrorMessage,
  getSyntheticEventMeta,
  logger
) {
  return function (guardUntilAllInitialized, ruleEventPair) {
    var rule = ruleEventPair.rule;
    var event = ruleEventPair.event;
    event.settings = event.settings || {};

    try {
      var syntheticEventMeta = getSyntheticEventMeta(ruleEventPair);

      executeDelegateModule(event, null, [
        /**
         * This is the callback that executes a particular rule when an event has occurred.
         * @param {Object} [syntheticEvent] An object that contains detail regarding the event
         * that occurred.
         */
        function (syntheticEvent) {
          // DTM-11871
          // If we're still in the process of initializing event modules,
          // we need to queue up any calls to trigger, otherwise if the triggered
          // rule does something that triggers a different rule whose event module
          // has not been initialized, that secondary rule will never get executed.
          // This can be removed if we decide to always use the rule queue, since
          // conditions and actions will be processed asynchronously, which
          // would give time for all event modules to be initialized.

          var normalizedSyntheticEvent = normalizeSyntheticEvent(
            syntheticEventMeta,
            syntheticEvent
          );

          guardUntilAllInitialized(function () {
            triggerRule(normalizedSyntheticEvent, rule);
          });
        }
      ]);
    } catch (e) {
      logger.error(getErrorMessage(event, rule, e));
    }
  };
};
