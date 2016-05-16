'use strict';

var logger = require('../logger');

describe('logger', function() {
  var STANDARD_LOG_METHODS = ['log', 'info', 'warn', 'error'];

  beforeEach(function() {
    spyOn(window.console, 'log');
    spyOn(window.console, 'info');
    spyOn(window.console, 'warn');
    spyOn(window.console, 'error');
    logger._history = [];
    logger.outputEnabled = false;
  });

  it('outputs a message when output is enabled and a logging method is called', function() {
    STANDARD_LOG_METHODS.forEach(function(fnName) {
      logger.outputEnabled = true;
      logger[fnName]('test ' + fnName);
      var calls = window.console[fnName].calls;
      expect(calls.count()).toBe(1);
      expect(calls.argsFor(0)[0]).toBe('SATELLITE: test ' + fnName);
    });
  });

  it('outputs all previously logged messages when output is enabled', function() {
    STANDARD_LOG_METHODS.forEach(function(fnName) {
      logger[fnName]('test ' + fnName);
      expect(window.console[fnName].calls.count()).toBe(0);
    });

    logger.outputEnabled = true;

    STANDARD_LOG_METHODS.forEach(function(fnName) {
      expect(window.console[fnName].calls.argsFor(0)[0]).toBe('SATELLITE: test ' + fnName);
    });
  });

  it('caps the log history', function() {
    for (var i = 0; i < 300; i++) {
      logger.log('test ' + i);
    }

    logger.outputEnabled = true;

    expect(window.console.log.calls.count()).toBe(100);
    expect(window.console.log.calls.argsFor(0)[0]).toBe('SATELLITE: test 200');
    expect(window.console.log.calls.argsFor(99)[0]).toBe('SATELLITE: test 299');
  });

  it('outputs a message when output is enabled and notify is called', function() {
    logger.outputEnabled = true;

    logger.notify('test log with argument', 1);
    expect(window.console.log.calls.count()).toBe(1);
    expect(window.console.log.calls.argsFor(0)[0]).toBe('SATELLITE: test log with argument');

    logger.notify('test log without argument');
    expect(window.console.log.calls.count()).toBe(2);
    expect(window.console.log.calls.argsFor(1)[0]).toBe('SATELLITE: test log without argument');

    logger.notify('test info', 3);
    expect(window.console.info.calls.count()).toBe(1);
    expect(window.console.info.calls.argsFor(0)[0]).toBe('SATELLITE: test info');

    logger.notify('test warn', 4);
    expect(window.console.warn.calls.count()).toBe(1);
    expect(window.console.warn.calls.argsFor(0)[0]).toBe('SATELLITE: test warn');

    logger.notify('test error', 5);
    expect(window.console.error.calls.count()).toBe(1);
    expect(window.console.error.calls.argsFor(0)[0]).toBe('SATELLITE: test error');
  });
});
