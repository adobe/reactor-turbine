'use strict';

/**
 * Custom condition. This executes a condition script provided by the user.
 * @param {Object} settings
 * @param {Object} settings.conditionSettings Condition settings.
 * @param {Function} settings.conditionSettings.script The custom script function.
 * @param {Object} [event] The underlying event object the triggered the rule.
 * @param {Object} [event.target] The element where the event originated.
 * @param {HTMLElement} [relatedElement] The element the rule was targeting.
 * @returns {boolean}
 */
module.exports = function(settings, event, relatedElement) {
  return settings.conditionSettings.script.call(
    relatedElement,
    event,
    event ? event.target : undefined);
};
