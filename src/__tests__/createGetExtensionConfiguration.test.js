'use strict';

describe('function returned by createGetExtensionConfiguration', function() {
  var createGetExtensionConfiguration = require('inject!../createGetExtensionConfiguration')({
    './public/replaceTokens': function(obj) {
      var replacedObj = {};

      // Simulate replacing data element tokens.
      Object.keys(obj).forEach(function(key) {
        replacedObj[key] = obj[key] + ' - replaced';
      });

      return replacedObj;
    }
  });

  it('returns configuration with data element tokens replaced', function() {
    var getExtensionConfiguration = createGetExtensionConfiguration({
      name: '%foo%'
    });

    expect(getExtensionConfiguration()).toEqual({
      name: '%foo% - replaced'
    });
  });

  it('gracefully handles undefined configuration', function() {
    var getExtensionConfiguration = createGetExtensionConfiguration();

    expect(getExtensionConfiguration()).toEqual({});
  });
});
