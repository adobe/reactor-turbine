'use strict';

var rewire = require('rewire');
var createExtensionCores = rewire('../createExtensionCores');

var preprocessConfig = function(config) {
  return config;
};

var promiseResolveSpy = jasmine.createSpy();

var Promise = function(init) {
  init(promiseResolveSpy, function() {});
};

Promise.prototype.then = function() {};

var logger = {
  log: jasmine.createSpy(),
  error: jasmine.createSpy()
};

createExtensionCores.__set__('preprocessConfig', preprocessConfig);
createExtensionCores.__set__('Promise', Promise);
createExtensionCores.__set__('logger', logger);

var coreRegistry = {
  register: jasmine.createSpy()
};

describe('createExtensionCores', function() {
  beforeEach(function() {
    promiseResolveSpy.calls.reset();
    logger.log.calls.reset();
    logger.error.calls.reset();
    coreRegistry.register.calls.reset();
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('logs an error when the core throws an error', function() {
    var coreDelegates = {
      get: function() {
        return function() {
          throw new Error('noob tried to divide by zero');
        };
      }
    };

    expect(function() {
      createExtensionCores({
            extensions: {
              testExtension: {
                name: 'Test Extension'
              }
            }
          },
          coreRegistry,
          coreDelegates);
    }).not.toThrowError();

    expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Error when initializing extension core for extension Test Extension');
  });

  it('registers a promise for a core delegate that does not return a promise', function() {
    var core = {};

    var coreDelegates = {
      get: function() {
        return function() {
          return core;
        };
      }
    };

    createExtensionCores({
      extensions: {
        testExtension: {
          name: 'TestExtension'
        }
      }
    },
    coreRegistry,
    coreDelegates);

    expect(coreRegistry.register.calls.mostRecent().args[0]).toBe('testExtension');
    expect(coreRegistry.register.calls.mostRecent().args[1] instanceof Promise).toBe(true);
    expect(promiseResolveSpy.calls.mostRecent().args[0]).toBe(core);
  });

  it('registers a promise for a core delegate that does return a promise', function() {
    var corePromise = new Promise(function() { });

    var coreDelegates = {
      get: function() {
        return function() {
          return corePromise;
        };
      }
    };

    createExtensionCores({
        extensions: {
          testExtension: {
            name: 'TestExtension'
          }
        }
      },
      coreRegistry,
      coreDelegates);

    expect(coreRegistry.register.calls.mostRecent().args).toEqual(['testExtension', corePromise]);
  });

  it('registers a promise for a core delegate that does not exist', function() {
    var coreDelegates = {
      get: function() {
        return function() {
          return null;
        };
      }
    };

    createExtensionCores({
        extensions: {
          testExtension: {
            name: 'TestExtension'
          }
        }
      },
      coreRegistry,
      coreDelegates);

    expect(coreRegistry.register.calls.mostRecent().args[0]).toBe('testExtension');
    expect(coreRegistry.register.calls.mostRecent().args[1] instanceof Promise).toBe(true);
    expect(promiseResolveSpy.calls.mostRecent().args[0]).toBe(null);
  });
});
