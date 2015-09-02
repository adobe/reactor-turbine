var mockVisitorTracking = {
  getSessionCount: function() {
    return 5;
  }
};

var conditionDelegateInjector = require('inject!../sessions');
var conditionDelegate = conditionDelegateInjector({
  'dtm/visitorTracking': mockVisitorTracking,
  'dtm/compareNumbers': require('../../../resources/compareNumbers')()
});

describe('sessions condition delegate', function() {
  it('returns true when number of sessions is above "greater than" constraint', function() {
    var config = {
      conditionConfig: {
        count: 4,
        operator: '>'
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when number of sessions is below "greater than" constraint', function() {
    var config = {
      conditionConfig: {
        count: 6,
        operator: '>'
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when number of sessions is below "less than" constraint', function() {
    var config = {
      conditionConfig: {
        count: 6,
        operator: '<'
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when number of sessions is above "less than" constraint', function() {
    var config = {
      conditionConfig: {
        count: 4,
        operator: '<'
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when number of sessions matches "equals" constraint', function() {
    var config = {
      conditionConfig: {
        count: 5,
        operator: '='
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when number of sessions does not match "equals" constraint', function() {
    var config = {
      conditionConfig: {
        count: 11,
        operator: '='
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
