'use strict';

var mockWindow = {
  screen: {
    width: 1366,
    height: 768
  }
};

var conditionDelegateInjector = require('inject!../screenResolution');
var conditionDelegate = conditionDelegateInjector({
  window: mockWindow,
  'dtm/compareNumbers': require('../../../resources/compareNumbers')()
});

function getConfig(width, widthOperator, height, heightOperator) {
  return {
    conditionConfig: {
      width: width,
      widthOperator: widthOperator,
      height: height,
      heightOperator: heightOperator
    }
  };
}

describe('screen resolution condition delegate', function() {
  it('returns true when dimension is above "greater than" constraint', function() {
    var config = getConfig(1365, '>', 768, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is below "greater than" constraint', function() {
    var config = getConfig(1366, '>', 768, '=');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension is below "less than" constraint', function() {
    var config = getConfig(1366, '=', 769, '<');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is above "less than" constraint', function() {
    var config = getConfig(1366, '=', 768, '<');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension matches "equals" constraint', function() {
    var config = getConfig(1366, '=', 768, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension does not match "equals" constraint', function() {
    var config = getConfig(1366, '=', 767, '=');
    expect(conditionDelegate(config)).toBe(false);
  });
});
