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


describe('resolveRelativePath', function() {
  var resolveRelativePath = require('../resolveRelativePath');

  // resolveRelativePath makes some assumptions oriented to Turbine's specific usage. This keeps
  // performance high and file size low, but it means it's not intended to handle a wide range of
  // use cases.
  it('resolves relative paths under various scenarios', function() {
    var path;

    path = resolveRelativePath('extension/file1.js', './file2.js');
    expect(path).toBe('extension/file2.js');

    path = resolveRelativePath('extension/file1.js', './utils/file2.js');
    expect(path).toBe('extension/utils/file2.js');

    path = resolveRelativePath('extension/src/lib/events/file1.js', '../../utils/math/file2.js');
    expect(path).toBe('extension/src/utils/math/file2.js');

    path = resolveRelativePath('extension/src/lib/events/file1.js', './../../utils/math/file2.js');
    expect(path).toBe('extension/src/utils/math/file2.js');

    path = resolveRelativePath('extension/src/lib/events/file1.js', '..//../utils/math/file2.js');
    expect(path).toBe('extension/src/utils/math/file2.js');

    // This is an invalid relative path but we do our best and don't throw errors.
    path = resolveRelativePath('extension/file1.js', '../../../../file2.js');
    expect(path).toBe('file2.js');

    path = resolveRelativePath('extension/file.js', './file2');
    expect(path).toBe('extension/file2.js');
  });
});
