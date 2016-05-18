'use strict';

describe('moduleProvider', function() {
  var logger;
  var injectModuleProvider = require('inject!../moduleProvider');
  var referencePath = 'hello-world/src/foo.js';
  var displayName = 'Foo';
  var moduleExports = {};
  var extractModuleExports;
  var moduleProvider;

  beforeEach(function() {
    logger = jasmine.createSpyObj('logger', ['log', 'error']);
    extractModuleExports = jasmine.createSpy().and.callFake(require('../extractModuleExports'));

    moduleProvider = injectModuleProvider({
      './public/logger': logger,
      './extractModuleExports': extractModuleExports
    });
    
    var module = {
      displayName: displayName,
      script: function(module) {
        module.exports = moduleExports;
      }
    };
    
    var require = function() {};
    
    moduleProvider.registerModule(referencePath, module, require);
  });
  
  it('does not attempt to extract the module export when only registering a module', function() {
    expect(extractModuleExports.calls.count()).toBe(0);
  });

  it('hydrates cache', function() {
    moduleProvider.hydrateCache();
    expect(extractModuleExports.calls.count()).toBe(1);
    moduleProvider.getModuleExports(referencePath);
    expect(extractModuleExports.calls.count()).toBe(1);
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
