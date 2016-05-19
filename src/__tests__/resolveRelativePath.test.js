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
  });
});
