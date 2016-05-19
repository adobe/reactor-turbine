describe('hasDomContentLoaded', function() {
  runTestPage('should return false when DOMContentLoaded was not fired yet',
    __dirname + '/domContentLoadedNotFired.html');
  runTestPage('should return true when DOMContentLoaded has fired',
    __dirname + '/domContentLoadedHasFired.html');

  it('returns true after DOM content was loaded', function() {
    var injectHasDomContentLoaded = require('inject!../hasDomContentLoaded');
    var hasDomContentLoaded = injectHasDomContentLoaded({
      'document': {
        readyState: 'complete'
      }
    });

    expect(hasDomContentLoaded()).toBe(true);
  });
});
