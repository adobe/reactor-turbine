'use strict';

describe('function returned by createGetExtensionConfiguration', function() {
  var createGetExtensionSettings = require('inject!../createGetExtensionSettings')({
    './public/replaceTokens': function(obj) {
      var replacedObj = {};

      // Simulate replacing data element tokens.
      Object.keys(obj).forEach(function(key) {
        replacedObj[key] = obj[key] + ' - replaced';
      });

      return replacedObj;
    }
  });

  it('returns settings with data element tokens replaced', function() {
    var getExtensionSettings = createGetExtensionSettings({
      name: '%foo%'
    });

    expect(getExtensionSettings()).toEqual({
      name: '%foo% - replaced'
    });
  });

  it('gracefully handles undefined settings', function() {
    var getExtensionSettings = createGetExtensionSettings();

    expect(getExtensionSettings()).toEqual({});
  });
});
