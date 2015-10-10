describe('hasDomContentLoaded', function() {
  runTestPage('should return false when DOMContentLoaded was not fired yet',
    __dirname + '/domContentLoadedNotFired.html');
  runTestPage('should return true when DOMContentLoaded has fired',
    __dirname + '/domContentLoadedHasFired.html');
});
