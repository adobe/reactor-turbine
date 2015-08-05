'use strict';

var triggers = [];

function getCurrentZoom() {
  return document.documentElement.clientWidth / window.innerWidth;
}

function callTriggers(event) {
  triggers.forEach(function(trigger) {
    trigger(event, document);
  });
}

if ('ongestureend' in window && 'ontouchend' in window) {
  var lastZoom = getCurrentZoom();
  var gestureEndTime;
  var delayFire = 1000;
  var currentTimer;

  document.addEventListener('gestureend', function(){
    gestureEndTime = + new Date();

    // Could we use a generic throttling or debouncing function?
    setTimeout(function(){
      var z = getCurrentZoom();

      if (z === lastZoom) {
        return;
      }

      lastZoom = z;

      if (currentTimer) {
        clearTimeout(currentTimer);
      }

      currentTimer = setTimeout(function(){
        currentTimer = null;

        var z = getCurrentZoom();

        if (lastZoom === z) {
          callTriggers({
            type: 'zoomchange',
            method: 'pinch',
            zoom: z.toFixed(2),
            target: document
          });
        }
      }, delayFire);
    }, 50);
  });

  document.addEventListener('touchend', function(){
    console.log('step 1')
    if (gestureEndTime && (+new Date() - gestureEndTime) < 50) {
      console.log('gettin trapped');
      return;
    }

    // Could we use a generic throttling or debouncing function?
    setTimeout(function(){
      console.log('step 2')
      var z = getCurrentZoom();

      if (z === lastZoom) {
        return;
      }

      lastZoom = z;

      if (currentTimer) {
        clearTimeout(currentTimer)
      }

      currentTimer = setTimeout(function(){
        console.log('step 3')
        currentTimer = null;
        var z = getCurrentZoom();
        if (lastZoom === z) {
          callTriggers({
            type: 'zoomchange',
            method: 'double tap',
            zoom: z.toFixed(2),
            target: document
          });
        }
      }, delayFire);
    }, 250);
  });
}

/**
 * The zoomchange event. This event occurs when the zoom level has changed on an iOS device.
 * This is unsupported on Android.
 * @param {Object} config
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  triggers.push(trigger);
};
