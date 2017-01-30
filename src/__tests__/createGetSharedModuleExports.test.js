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

describe('function returned by createGetSharedModuleExports', function() {
  var createGetSharedModuleExports = require('../createGetSharedModuleExports');
  var getSharedModuleExports;

  beforeEach(function() {
    var extensions = {
      'hello-world': {
        modules: {
          'hello-world/src/foo.js': {
            sharedName: 'foo'
          },
          'hello-world/src/baz.js': {
          }
        }
      }
    };

    var moduleProvider = {
      getModuleExports: function(referencePath) {
        return 'exports from ' + referencePath;
      }
    };

    getSharedModuleExports = createGetSharedModuleExports(extensions, moduleProvider);
  });

  it('returns a shared module\'s exports', function() {
    var exports = getSharedModuleExports('hello-world', 'foo');
    expect(exports).toBe('exports from hello-world/src/foo.js');
  });

  it('returns undefined if no matching extension is found', function() {
    var exports = getSharedModuleExports('goodbye-moon', 'foo');
    expect(exports).toBeUndefined();
  });

  it('returns undefined if no matching shared module is found', function() {
    var exports = getSharedModuleExports('hello-world', 'baz');
    expect(exports).toBeUndefined();
  });
});
