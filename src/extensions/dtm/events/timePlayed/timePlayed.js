'use strict';

var bubbly = require('bubbly')();
var dataStash = require('createDataStash')('timePlayed');

var LAST_TRIGGERED = 'lastTriggered';
var relevantMarkers = [];

/**
 * Unit string values.
 * @enum {string}
 */
var TIME_PLAYED_UNIT = {
  SECOND: 'second',
  PERCENT: 'percent'
};

function getPseudoEventType(amount, unit) {
  var unitSuffix = unit === TIME_PLAYED_UNIT.SECOND ? 's' : '%';
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
    var configuredSeconds = eventConfig.unit === TIME_PLAYED_UNIT.SECOND ?
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
 * @param {TIME_PLAYED_UNIT} config.eventConfig.unit The unit of duration measurement.
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

  // Re-use the event config object for configuring the bubbly listener since it has most
  // everything needed. Use Object.create so we can add a type attribute without modifying the
  // original object.
  var bubblyEventConfig = Object.create(config.eventConfig);
  bubblyEventConfig.type = getPseudoEventType(config.eventConfig.amount, config.eventConfig.unit);
  bubbly.addListener(bubblyEventConfig, trigger);
};
