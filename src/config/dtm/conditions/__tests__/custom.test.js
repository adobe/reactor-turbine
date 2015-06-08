var conditionDelegate = require('../custom');

describe('custom condition delegate', function() {
  it('should run a user-defined function', function() {
    var settings = {
      script: function() {
        return true;
      }
    };

    var eventDetail = {};

    spyOn(settings, 'script').and.callThrough();
    conditionDelegate(settings, eventDetail);

    expect(settings.script.calls.first()).toEqual({
      object: settings,
      args: [eventDetail],
      returnValue: true
    });
  });
});
