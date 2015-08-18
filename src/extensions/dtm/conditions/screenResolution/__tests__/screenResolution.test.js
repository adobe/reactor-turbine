'use strict';

var mockWindow = {
  screen: {
    width: 1366,
    height: 768
  }
};

var conditionDelegateInjector = require('inject!../screenResolution');
var conditionDelegate = conditionDelegateInjector({
  window: mockWindow
});

describe('screen resolution condition delegate', function() {
  it('returns true when dimension is inside greater than range', function() {
    var config = {
      conditionConfig: {
        width: 1365,
        widthOperator: '>',
        height: 768,
        heightOperator: '='
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is outside greater than range', function() {
    var config = {
      conditionConfig: {
        width: 1366,
        widthOperator: '>',
        height: 768,
        heightOperator: '='
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension is inside less than range', function() {
    var config = {
      conditionConfig: {
        width: 1366,
        widthOperator: '=',
        height: 769,
        heightOperator: '<'
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is outside less than range', function() {
    var config = {
      conditionConfig: {
        width: 1366,
        widthOperator: '=',
        height: 768,
        heightOperator: '<'
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension is inside equal range', function() {
    var config = {
      conditionConfig: {
        width: 1366,
        widthOperator: '=',
        height: 768,
        heightOperator: '='
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is outside equal range', function() {
    var config = {
      conditionConfig: {
        width: 1366,
        widthOperator: '=',
        height: 767,
        heightOperator: '='
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
