/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var getReplaceTokens = function(options) {
  options = options || {};

  return require('inject-loader!../replaceTokens')({
    './isVar': options.isVar || function() { return true; },
    './getVar': options.getVar || function() {},
    './state': options.state || {
      getPropertySettings: function() {
        return {};
      }
    }
  });
};

describe('replaceTokens', function() {
  it('replaces nested tokens', function() {
    var replaceTokens = getReplaceTokens({
      getVar: function(variableName) {
        return 'replaced:' + variableName;
      }
    });

    var result = replaceTokens({
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
    var replaceVarTokens = getReplaceTokens({
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

  it('replace token if var value is null and ' +
    'undefinedVarsReturnEmpty = false', function() {
    var replaceVarTokens = getReplaceTokens({
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

    expect(replaceVarTokens('foo %bar%')).toBe('foo null');
  });

  it('does not replace token if var definition is not found', function() {
    var replaceVarTokens = getReplaceTokens({
      isVar: function() {
        return false;
      }
    });

    expect(replaceVarTokens('foo %bar%')).toBe('foo %bar%');
  });

  it('returns the data element\'s raw value if only a ' +
    'single data element token is given', function() {
    var objValue = {};

    var replaceVarTokens = getReplaceTokens({
      getVar: function() {
        return objValue;
      }
    });

    expect(replaceVarTokens('%foo%')).toBe(objValue);
  });

  it('does not return the data element\'s raw value if string starts and ends with different ' +
    'data element tokens', function() {
    var replaceVarTokens = getReplaceTokens({
      getVar: function() {
        return 'quux';
      }
    });

    // tests regex robustness
    expect(replaceVarTokens('%foo% and %bar%')).toBe('quux and quux');
  });

  it('returns the argument unmodified if it is an unsupported type', function() {
    var replaceVarTokens = getReplaceTokens();

    var fn = function() {};
    expect(replaceVarTokens(fn)).toBe(fn);
  });
});
