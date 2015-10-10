'use strict';

describe('sdsat_debug local storage setting', function() {
  runTestPage('logs to the console when set to true', __dirname + '/sdsatDebugFalse.html');
  runTestPage('does not log to console when not set', __dirname + '/sdsatDebugTrue.html');
});

describe('setDebug', function() {
  runTestPage('toggles logging to the console', __dirname + '/setDebug.html');
});
