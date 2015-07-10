'use strict';

describe('directCall event type', function() {
  runTestPage(
    'triggers rule when _satellite.track() is called with matching name',
    'directCall.html');
});
