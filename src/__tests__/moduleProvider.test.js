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

describe('moduleProvider', function() {
  var logger;
  var injectModuleProvider = require('inject!../moduleProvider');
  var referencePath = 'hello-world/src/foo.js';
  var displayName = 'Foo';
  var moduleExports = {};
  var extractModuleExports = require('../extractModuleExports');
  var extractModuleExportsSpy;
  var moduleProvider;

  beforeEach(function() {
    logger = jasmine.createSpyObj('logger', ['log', 'error']);
    extractModuleExportsSpy = jasmine.createSpy('m').and.callFake(extractModuleExports);

    moduleProvider = injectModuleProvider({
      './logger': logger,
      './extractModuleExports': extractModuleExportsSpy
    });

    var module = {
      displayName: displayName,
      script: function(module) {
        module.exports = moduleExports;
      }
    };

    var require = function(path) { return path; };

    moduleProvider.registerModule(referencePath, module, require);
  });

  it('does not attempt to extract the module export when only registering a module', function() {
    expect(extractModuleExportsSpy.calls.count()).toBe(0);
  });

  it('hydrates cache', function() {
    moduleProvider.hydrateCache();
    expect(extractModuleExportsSpy.calls.count()).toBe(1);
    moduleProvider.getModuleExports(referencePath);
    expect(extractModuleExportsSpy.calls.count()).toBe(1);
  });

  it('logs an error if error is thrown while hydrating cache', function() {
    moduleProvider.registerModule(
      referencePath,
      {
        displayName: 'Foo',
        script: function() {
          throw new Error('noob tried to divide by zero.');
        }
      }
    );

    moduleProvider.hydrateCache();

    var errorMessage = logger.error.calls.mostRecent().args[0];
    expect(errorMessage).toStartWith('Error initializing module ' + referencePath +
      '. noob tried to divide by zero.');
  });

  it('returns module exports', function() {
    expect(moduleProvider.getModuleExports(referencePath)).toBe(moduleExports);
  });

  it('returns display name', function() {
    expect(moduleProvider.getModuleDisplayName(referencePath)).toBe('Foo');
  });

  it('throws an error when a module is not found', function() {
    expect(function() {
      moduleProvider.getModuleExports('hello-world/src/invalid.js');
    }).toThrowError('Module hello-world/src/invalid.js not found.');
  });
});
