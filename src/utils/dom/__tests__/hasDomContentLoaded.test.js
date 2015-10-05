var domContentLoadedHasFired = require('../hasDomContentLoaded');

describe('hasDomContentLoaded', function() {
  runTestPage('should return false when DOMContentLoaded was not fired yet',
    'domContentLoadedNotFired.html');
  runTestPage('should return true when DOMContentLoaded has fired',
    'domContentLoadedHasFired.html');
});
