'use strict';

var bubbly = require('createBubbly')();
var dataStash = require('createDataStash')('timePlayed');

var LAST_TRIGGERED = 'lastTriggered';
var relevantMarkers = [];

/**
 * Unit string values.
 * @enum {string}
 */
var timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

function getPseudoEventType(amount, unit) {
  var unitSuffix = unit === timePlayedUnit.SECOND ? 's' : '%';
  return 'videoplayed(' + amount + unitSuffix + ')';
}

function getPseudoEvent(amount, unit, target) {
  return {
    type: getPseudoEventType(amount, unit),
    target: target,
    amount: amount,
    unit: unit
  };
}

function handleTimeUpdate(event) {
  var target = event.target;

  if (!target.seekable || !target.seekable.length) {
    return;
  }

  var seekable = target.seekable;
  var startTime = seekable.start(0);
  var endTime = seekable.end(0);
  var currentTime = target.currentTime;
  var playedSeconds = currentTime - startTime;

  var secondsLastTriggered = dataStash(target, LAST_TRIGGERED) || 0;
  var pseudoEvent;

  relevantMarkers.forEach(function(eventConfig) {
    var configuredSeconds = eventConfig.unit === timePlayedUnit.SECOND ?
      eventConfig.amount : (endTime - startTime) * (eventConfig.amount / 100);
    if (configuredSeconds > secondsLastTriggered && configuredSeconds <= playedSeconds) {
      pseudoEvent = getPseudoEvent(eventConfig.amount, eventConfig.unit, target);
      bubbly.evaluateEvent(pseudoEvent);
    }
  });

  dataStash(event.target, LAST_TRIGGERED, playedSeconds);
}

document.addEventListener('timeupdate', handleTimeUpdate, true);

/**
 * The time played event. This event occurs when the media has been played for a specified amount
 * of time.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @param {number} config.eventConfig.amount The amount of time the media must be played before
 * this event is fired. This value may either be number of seconds (20 for 20 seconds) or a
 * percent value (20 for 20%).
 * @param {timePlayedUnit} config.eventConfig.unit The unit of duration measurement.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var doesMarkerMatch = function(marker) {
    return marker.amount === config.eventConfig.amount && marker.unit === config.eventConfig.unit;
  };

  var markerRegistered = relevantMarkers.some(doesMarkerMatch);

  if (!markerRegistered) {
    relevantMarkers.push({
      amount: config.eventConfig.amount,
      unit: config.eventConfig.unit
    });
  }

  var pseudoEventType = getPseudoEventType(config.eventConfig.amount, config.eventConfig.unit);

  bubbly.addListener(config.eventConfig, function(event, relatedElement) {
    // Bubbling for this event is dependent upon the amount and unit configured for rules.
    // An event can "bubble up" to other rules with the same amount and unit but not to rules with
    // a different amount or unit. See the tests for how this plays out.
    if (event.type === pseudoEventType) {
      trigger(event, relatedElement);
    } else {
      return false;
    }
  });
};
