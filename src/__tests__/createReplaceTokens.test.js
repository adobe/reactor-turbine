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
var createReplaceTokens = require('../createReplaceTokens');

describe('function returned by replaceTokens', function() {
  it('replaces nested tokens', function() {
    var isVar = function() { return true; };
    var getVar = function(variableName) { return 'replaced:' + variableName; };
    var undefinedVarsReturnEmpty = false;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);
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
    var isVar = function() { return true; };
    var getVar = function() { return null; };
    var undefinedVarsReturnEmpty = true;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);

    expect(replaceTokens('foo %bar%')).toBe('foo ');
  });

  it('replace token if var value is null and undefinedVarsReturnEmpty = false', function() {
    var isVar = function() { return true; };
    var getVar = function() { return null; };
    var undefinedVarsReturnEmpty = false;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);

    expect(replaceTokens('foo %bar%')).toBe('foo null');
  });

  it('does not replace token if var definition is not found', function() {
    var isVar = function() { return false; };
    var getVar = function() {};
    var undefinedVarsReturnEmpty = false;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);

    expect(replaceTokens('foo %bar%')).toBe('foo %bar%');
  });

  it('returns the data element\'s raw value if only a ' +
    'single data element token is given', function() {
    var isVar = function() { return true; };
    var objValue = {};
    var getVar = function() { return objValue; };
    var undefinedVarsReturnEmpty = false;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);

    expect(replaceTokens('%foo%')).toBe(objValue);
  });

  it('does not return the data element\'s raw value if string starts and ends with different ' +
    'data element tokens', function() {
    var isVar = function() { return true; };
    var getVar = function() { return 'quux'; };
    var undefinedVarsReturnEmpty = false;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);

    // tests regex robustness
    expect(replaceTokens('%foo% and %bar%')).toBe('quux and quux');
  });

  it('returns the argument unmodified if it is an unsupported type', function() {
    var isVar = function() { return true; };
    var getVar = function() { };
    var undefinedVarsReturnEmpty = false;
    var replaceTokens = createReplaceTokens(isVar, getVar, undefinedVarsReturnEmpty);

    var fn = function() {};
    expect(replaceTokens(fn)).toBe(fn);
  });
});
