var rewire = require('rewire');
var dataElementDelegate = rewire('../queryParam');

var getQueryParamSpy = jasmine.createSpy().and.returnValue('bar');
dataElementDelegate.__set__('getQueryParam', getQueryParamSpy);

describe('queryParam data element delegate', function() {
  it('should return a query parameter value', function() {
    var settings = {
      name: 'foo',
      ignoreCase: true
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
    expect(getQueryParamSpy.calls.argsFor(0)).toEqual(['foo', true]);
  });
});
