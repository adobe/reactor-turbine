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
var injectCreateReplaceTokens = require('inject-loader!../createReplaceTokens');

describe('function returned by replaceTokens', function () {
  var isVar;
  var getVar;
  var undefinedVarsReturnEmpty;
  var logger;
  var createReplaceTokens;

  beforeEach(function () {
    logger = jasmine.createSpyObj('logger', ['error']);
    isVar = function () {
      return true;
    };
    getVar = function () {
      return null;
    };
    undefinedVarsReturnEmpty = false;
    createReplaceTokens = injectCreateReplaceTokens({
      './logger': logger
    });
  });

  it('replaces nested tokens', function () {
    getVar = function (variableName) {
      return 'replaced:' + variableName;
    };
    var replaceTokens = createReplaceTokens(
      isVar,
      getVar,
      undefinedVarsReturnEmpty
    );
    var result = replaceTokens({
      foo: [
        {},
        {
          bar: '%unicorn% and %dinosaur% tracks',
          zoo: '%unicorn% and %dinosaur%'
        }
      ],
      fruits: ['%apple%', 'banana']
    });

    expect(result).toEqual({
      foo: [
        {},
        {
          bar: 'replaced:unicorn and replaced:dinosaur tracks',
          zoo: 'replaced:unicorn and replaced:dinosaur'
        }
      ],
      fruits: ['replaced:apple', 'banana']
    });
  });

  it(
    'replaces token with empty string if value is null and ' +
      'undefinedVarsReturnEmpty = true',
    function () {
      var undefinedVarsReturnEmpty = true;
      var replaceTokens = createReplaceTokens(
        isVar,
        getVar,
        undefinedVarsReturnEmpty
      );

      expect(replaceTokens('foo %bar%')).toBe('foo ');
    }
  );

  it('replace token if var value is null and undefinedVarsReturnEmpty = false', function () {
    var replaceTokens = createReplaceTokens(
      isVar,
      getVar,
      undefinedVarsReturnEmpty
    );

    expect(replaceTokens('foo %bar%')).toBe('foo null');
  });

  it('does not replace token if var definition is not found', function () {
    isVar = function () {
      return false;
    };
    var replaceTokens = createReplaceTokens(
      isVar,
      getVar,
      undefinedVarsReturnEmpty
    );

    expect(replaceTokens('foo %bar%')).toBe('foo %bar%');
  });

  it(
    "returns the data element's raw value if only a " +
      'single data element token is given',
    function () {
      var objValue = {};
      getVar = function () {
        return objValue;
      };
      var replaceTokens = createReplaceTokens(
        isVar,
        getVar,
        undefinedVarsReturnEmpty
      );

      expect(replaceTokens('%foo%')).toBe(objValue);
    }
  );

  it(
    "does not return the data element's raw value if string starts and ends with different " +
      'data element tokens',
    function () {
      getVar = function () {
        return 'quux';
      };
      var replaceTokens = createReplaceTokens(
        isVar,
        getVar,
        undefinedVarsReturnEmpty
      );

      // tests regex robustness
      expect(replaceTokens('%foo% and %bar%')).toBe('quux and quux');
    }
  );

  it('returns the argument unmodified if it is an unsupported type', function () {
    var replaceTokens = createReplaceTokens(
      isVar,
      getVar,
      undefinedVarsReturnEmpty
    );

    var fn = function () {};
    expect(replaceTokens(fn)).toBe(fn);
  });

  it('handles recursive data element references', function () {
    var replaceTokens;

    var de1Settings = {
      foo: '%de2%'
    };

    var de2Settings = {
      foo: '%de1%'
    };

    getVar = function (variableName) {
      var result = replaceTokens(
        variableName === 'de1' ? de1Settings : de2Settings
      );
      return result.foo;
    };

    replaceTokens = createReplaceTokens(
      isVar,
      getVar,
      undefinedVarsReturnEmpty
    );

    expect(replaceTokens(de1Settings)).toEqual({
      foo: '%de1%'
    });
    expect(logger.error).toHaveBeenCalledWith(
      'Data element circular reference detected: ' +
        'de2 -> de1 -> de2 -> de1 -> de2 -> de1 -> de2 -> de1 -> de2 -> de1 -> de2'
    );
  });
});
