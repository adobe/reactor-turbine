'use strict';

var bubbly = require('bubbly');
var covertData = require('covertData');

var LAST_TRIGGERED_DATA_KEY = 'dtm.timePlayed.LastTriggered';

/**
 * Unit string values.
 * @enum {string}
 */
var TIME_PLAYED_UNIT = {
  SECOND: 'second',
  PERCENT: 'percent'
};

var bubblyByPercent = {};
var bubblyBySecond = {};

function getPseudoEvent(amount, unit, target) {
  var event = {};
  var unitSuffix;

  switch (unit) {
    case TIME_PLAYED_UNIT.SECOND:
      unitSuffix = 's';
      break;
    case TIME_PLAYED_UNIT.PERCENT:
      unitSuffix = '%';
      break;
  }

  // built to match behavior of prior engine.
  event.type = 'videoplayed(' + amount + unitSuffix + ')';
  event.target = target;
  return event;
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
  var playedPercent = 100 * (currentTime - startTime) / (endTime - startTime);
  var playedSeconds = currentTime - startTime;

  var secondsLastTriggered = covertData(target, LAST_TRIGGERED_DATA_KEY) || 0;
  var pseudoEvent;

  for (var bubblySecond in bubblyBySecond) {
    bubblySecond = parseFloat(bubblySecond);
    if (bubblySecond > secondsLastTriggered && bubblySecond <= playedSeconds) {
      pseudoEvent = getPseudoEvent(bubblySecond, TIME_PLAYED_UNIT.SECOND, target);
      bubblyBySecond[bubblySecond].evaluateEvent(pseudoEvent);
    }
  }

  for (var bubblyPercent in bubblyByPercent) {
    bubblyPercent = parseFloat(bubblyPercent);
    var bubblySecondsEquivalent = (endTime - startTime) * (bubblyPercent / 100);
    if (bubblySecondsEquivalent > secondsLastTriggered && bubblyPercent <= playedPercent) {
      pseudoEvent = getPseudoEvent(bubblyPercent, TIME_PLAYED_UNIT.PERCENT, target);
      bubblyByPercent[bubblyPercent].evaluateEvent(pseudoEvent);
    }
  }

  covertData(event.target, LAST_TRIGGERED_DATA_KEY, playedSeconds);
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
  var bubblyByAmount;

  switch (config.eventConfig.unit) {
    case TIME_PLAYED_UNIT.SECOND:
      bubblyByAmount = bubblyBySecond;
      break;
    case TIME_PLAYED_UNIT.PERCENT:
      bubblyByAmount = bubblyByPercent;
      break;
  }

  var timePlayedBubbly = bubblyByAmount[config.eventConfig.amount];

  if (!timePlayedBubbly) {
    timePlayedBubbly = bubblyByAmount[config.eventConfig.amount] = bubbly();
  }

  timePlayedBubbly.addListener(config.eventConfig, trigger);
};
