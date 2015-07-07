'use strict';

var conditionDelegate = require('../custom');

describe('custom condition delegate', function() {
  it('should run a user-defined function', function() {
    var config = {
      conditionConfig: {
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

    spyOn(config.conditionConfig, 'script').and.callThrough();
    conditionDelegate(config, event, relatedElement);

    expect(config.conditionConfig.script.calls.first()).toEqual({
      object: relatedElement,
      args: [event, event.target],
      returnValue: true
    });
  });
});
