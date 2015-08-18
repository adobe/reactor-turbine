'use strict';

var mockClientInfo = {
  browser: 'Some Browser'
};

var conditionDelegateInjector = require('inject!../browser');
var conditionDelegate = conditionDelegateInjector({
  clientInfo: mockClientInfo
});

describe('browser condition delegate', function() {
  it('returns true when the current browser matches one of the selected browsers', function() {
    mockClientInfo.browser = 'Foo';

    var config = {
      conditionConfig: {
        browsers: ['Shoe', 'Goo', 'Foo', 'Moo']
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the current browser does not match any of the ' +
      'selected browsers', function() {
    mockClientInfo.browser = 'Foo';

    var config = {
      conditionConfig: {
        browsers: ['Shoe', 'Goo', 'Boo', 'Moo']
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
