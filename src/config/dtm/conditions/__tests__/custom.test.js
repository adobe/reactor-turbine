'use strict';

var conditionDelegate = require('../custom');

describe('custom condition delegate', function() {
  it('should run a user-defined function', function() {
    var settings = {
      conditionSettings: {
        script: function() {
          return true;
        }
      }
    };

    var event = {
      currentTarget: {},
      target: {}
    };

    var relatedElement = {};

    spyOn(settings.conditionSettings, 'script').and.callThrough();
    conditionDelegate(settings, event, relatedElement);

    expect(settings.conditionSettings.script.calls.first()).toEqual({
      object: relatedElement,
      args: [event, event.target],
      returnValue: true
    });
  });
});
