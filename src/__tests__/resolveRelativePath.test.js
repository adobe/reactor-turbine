/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
