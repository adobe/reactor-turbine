'use strict';

describe('sdsat_debug local storage setting', function() {
  runTestPage('logs to the console when set to true', 'sdsatDebugFalse.html');
  runTestPage('does not log to console when not set', 'sdsatDebugTrue.html');
});

describe('setDebug', function() {
  runTestPage('logs to the console when called with true', 'setDebugTrue.html');
});
