'use strict';

var poll = require('poll');
var dataStash = require('createDataStash')('elementExists');
var bubbly = require('createBubbly')();
var SEEN = 'seen';

/**
 *
 * @type {string[]} Selectors from all the rules.
 */
var selectors = [];

poll('element exists event delegate', function() {
  for (var i = 0; i < selectors.length; i++) {
    var selector = selectors[i];
    var element = document.querySelector(selector);

    if (element) {
      // If the element has been seen before, bubbly will have already run all rules that apply
      // to it.
      if (!dataStash(element, SEEN)) {
        dataStash(element, SEEN, true);
        bubbly.evaluateEvent({
          type: 'elementexists',
          target: element
        });
      }

      // No need to keep watching for the selector.
      // While we could use a reverse loop to enable us to splice the array safely, we don't
      // because all other DTM event types execute rules in the order they were registered and we
      // like to be consistent.
      selectors.splice(i--, 1);
    }
  }
});

/**
 * Element exists event. This event occurs when an element has been added to the DOM. The rule
 * should only run once per targeted element.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  bubbly.addListener(config.eventConfig, trigger);

  if (selectors.indexOf(config.eventConfig.selector) === -1) {
    selectors.push(config.eventConfig.selector);
  }
};
