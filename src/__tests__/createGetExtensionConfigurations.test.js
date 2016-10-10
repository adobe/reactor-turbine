'use strict';

describe('function returned by createGetExtensionConfigurations', function() {
  var createGetExtensionConfigurations = require('inject!../createGetExtensionConfigurations')({
    './replaceVarTokens': function(obj) {
      var replacedObj = {};

      // Simulate replacing data element tokens.
      Object.keys(obj).forEach(function(key) {
        replacedObj[key] = obj[key] + ' - replaced';
      });

      return replacedObj;
    }
  });

  it('returns configurations with data element tokens replaced', function() {
    var getExtensionConfigurations = createGetExtensionConfigurations([
      {
        id: 'id1',
        name: 'extension configuration 1',
        settings: {
          foo: '%bar%'
        }
      },
      {
        id: 'id2',
        name: 'extension configuration 2',
        settings: {
          baz: '%qux%'
        }
      }
    ]);

    expect(getExtensionConfigurations()).toEqual([
      {
        id: 'id1',
        name: 'extension configuration 1',
        settings: {
          foo: '%bar% - replaced'
        }

      },
      {
        id: 'id2',
        name: 'extension configuration 2',
        settings: {
          baz: '%qux% - replaced'
        }
      }
    ]);
  });

  it('gracefully handles undefined configurations', function() {
    var getExtensionConfigurations = createGetExtensionConfigurations();

    expect(getExtensionConfigurations()).toEqual([]);
  });

  it('gracefully handles undefined settings objects', function() {
    var getExtensionConfigurations = createGetExtensionConfigurations([
      {
        id: 'id1',
        name: 'extension configuration 1'
      }
    ]);

    expect(getExtensionConfigurations()).toEqual([{
      id: 'id1',
      name: 'extension configuration 1',
      settings: {}
    }]);
  });
});
