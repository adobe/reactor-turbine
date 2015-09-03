'use strict';

var mockDocument = {
  documentElement: {
    clientWidth: 1366,
    clientHeight: 768
  }
};

var conditionDelegateInjector = require('inject!../windowSize');
var conditionDelegate = conditionDelegateInjector({
  document: mockDocument,
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

describe('window size condition delegate', function() {
  it('returns true when dimension is inside greater than range', function() {
    var config = getConfig(1365, '>', 768, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is outside greater than range', function() {
    var config = getConfig(1366, '>', 768, '=');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension is inside less than range', function() {
    var config = getConfig(1366, '=', 769, '<');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is outside less than range', function() {
    var config = getConfig(1366, '=', 768, '<');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension is inside equal range', function() {
    var config = getConfig(1366, '=', 768, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is outside equal range', function() {
    var config = getConfig(1366, '=', 767, '=');
    expect(conditionDelegate(config)).toBe(false);
  });
});
