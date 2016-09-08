'use strict';

var getReplaceVarTokens = function(options) {
  options = options || {};

  return require('inject!../replaceVarTokens')({
    './public/isPlainObject': require('../public/isPlainObject'),
    './public/getVar': options.getVar || function() {},
    './state': options.state || {
      getPropertySettings: function() {
        return {};
      }
    }
  });
};

describe('replaceVarTokens', function() {
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
          bar: '%unicorn% and %dinosaur% tracks',
          zoo: '%unicorn% and %dinosaur%'
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
          bar: 'replaced:unicorn and replaced:dinosaur tracks',
          zoo: 'replaced:unicorn and replaced:dinosaur'
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

  it('returns the data element\'s raw value if only a ' +
    'single data element token is given', function() {
    var objValue = {};

    var replaceVarTokens = getReplaceVarTokens({
      getVar: function() {
        return objValue;
      }
    });

    expect(replaceVarTokens('%foo%')).toBe(objValue);
  });

  it('does not return the data element\'s raw value if string starts and ends with different ' +
    'data element tokens', function() {
    var replaceVarTokens = getReplaceVarTokens({
      getVar: function() {
        return 'quux';
      }
    });

    // tests regex robustness
    expect(replaceVarTokens('%foo% and %bar%')).toBe('quux and quux');
  });

  it('returns the argument unmodified if it is an unsupported type', function() {
    var replaceVarTokens = getReplaceVarTokens();

    var fn = function() {};
    expect(replaceVarTokens(fn)).toBe(fn);
  });
});
