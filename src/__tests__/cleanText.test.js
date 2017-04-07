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

var textCleaner = require('../cleanText');

describe('cleanText', function() {
  it('removes extra spaces from a string', function() {
    expect(textCleaner('Clean   multiple    spaces')).toEqual('Clean multiple spaces');
  });

  it('removes new lines from a string', function() {
    expect(textCleaner('new line here \n and\nhere \n')).toEqual('new line here and here');
  });

  it('returns same string if no modifications need to be made', function() {
    expect(textCleaner('This is my Perfect String')).toEqual('This is my Perfect String');
  });

  it('removes spaces from the beginning and end of a string', function() {
    expect(textCleaner('  This is my String     ')).toEqual('This is my String');
  });

  it('returns unmodified value it is not a string', function() {
    expect(textCleaner()).toBeUndefined();
    expect(textCleaner(123)).toBe(123);
    var obj = {};
    expect(textCleaner(obj)).toBe(obj);
  });
});
