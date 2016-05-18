'use strict';

describe('function returned by createGetExtensionConfigurations', function() {
  var createGetExtensionConfigurations = require('inject!../createGetExtensionConfigurations')({
    './replaceVarTokens': function(obj) {
      var replacedObj = {};

      Object.keys(obj).forEach(function(key) {
        replacedObj[key] = obj[key] + ' - replaced';
      });

      return replacedObj;
    }
  });
  
  it('returns configurations with data element tokens replaced', function() {
    var getExtensionConfigurations = createGetExtensionConfigurations({
      id1: {
        settings: {
          foo: 'bar'
        }
      },
      id2: {
        settings: {
          baz: 'qux'
        }
      }
    });

    expect(getExtensionConfigurations()).toEqual({
      id1: {
        foo: 'bar - replaced'
      },
      id2: {
        baz: 'qux - replaced'
      }
    });
  });
});
