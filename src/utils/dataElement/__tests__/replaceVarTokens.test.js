'use strict';

var getReplaceVarTokens = function(options) {
  options = options || {};

  return require('inject!../replaceVarTokens')({
    '../isType/isPlainObject': require('../../isType/isPlainObject'),
    './getVar': options.getVar || function() {},
    '../../state': options.state || {
      getPropertySettings: function() {
        return {};
      }
    }
  });
};

describe('replaceVarTokens', function() {
  runTestPage('replaces tokens in objects', __dirname + '/replaceVarTokens.html');

  it('replaces nested tokens', function() {
    var replaceVarTokens = getReplaceVarTokens({
      getVar: function(variableName) {
        return 'replaced:' + variableName;
      }
    });

    var result = replaceVarTokens({
      foo: [
        {},
        {
          bar: '%unicorn% and %dinosaur% tracks'
        }
      ],
      fruits: [
        '%apple%',
        'banana'
      ]
    });

    expect(result).toEqual({
      foo: [
        {},
        {
          bar: 'replaced:unicorn and replaced:dinosaur tracks'
        }
      ],
      fruits: [
        'replaced:apple',
        'banana'
      ]
    });
  });

  it('replaces token with empty string if value is null and ' +
    'undefinedVarsReturnEmpty = true', function() {
    var replaceVarTokens = getReplaceVarTokens({
      getVar: function() {
        return null;
      },
      state: {
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: true
          };
        }
      }
    });

    expect(replaceVarTokens('foo %bar%')).toBe('foo ');
  });

  it('does not replace token if var value is null and ' +
    'undefinedVarsReturnEmpty = false', function() {
    var replaceVarTokens = getReplaceVarTokens({
      getVar: function() {
        return null;
      },
      state: {
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    expect(replaceVarTokens('foo %bar%')).toBe('foo %bar%');
  });

  it('returns things if it an unsupported type', function() {
    var replaceVarTokens = getReplaceVarTokens();

    var fn = function() {};
    expect(replaceVarTokens(fn)).toBe(fn);
  });
});
