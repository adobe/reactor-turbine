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

var logger = require('../logger');

var ROCKET = '\uD83D\uDE80';

var ieVersion = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

var messagePrefix = ieVersion === 9 || ieVersion === 10 ? '[Launch]' : ROCKET;

describe('logger', function() {
  var STANDARD_LOG_METHODS = ['log', 'info', 'warn', 'error'];

  beforeEach(function() {
    spyOn(window.console, 'log');
    spyOn(window.console, 'info');
    spyOn(window.console, 'warn');
    spyOn(window.console, 'error');
    logger.outputEnabled = false;
  });

  it('outputs a message when output is enabled and a logging method is called', function() {
    STANDARD_LOG_METHODS.forEach(function(fnName) {
      logger.outputEnabled = true;
      var calls = window.console[fnName].calls;
      // Enabling output can flush previously logged messages to the console. We don't want to
      // include those console calls in this test.
      calls.reset();
      logger[fnName]('test ' + fnName);
      expect(calls.count()).toBe(1);
      expect(calls.argsFor(0)[0]).toBe(messagePrefix + ' test ' + fnName);
    });
  });

  it('outputs all previously logged messages when output is enabled', function() {
    STANDARD_LOG_METHODS.forEach(function(fnName) {
      logger[fnName]('test ' + fnName);
      expect(window.console[fnName].calls.count()).toBe(0);
    });

    logger.outputEnabled = true;

    STANDARD_LOG_METHODS.forEach(function(fnName) {
      expect(window.console[fnName].calls.argsFor(0)[0]).toBe(messagePrefix + ' test ' + fnName);
    });
  });

  it('caps the log history', function() {
    for (var i = 0; i < 300; i++) {
      logger.log('test ' + i);
    }

    logger.outputEnabled = true;

    expect(window.console.log.calls.count()).toBe(100);
    expect(window.console.log.calls.argsFor(0)[0]).toBe(messagePrefix + ' test 200');
    expect(window.console.log.calls.argsFor(99)[0]).toBe(messagePrefix + ' test 299');
  });

  it('creates a logger prepared for consumers', function() {
    logger.outputEnabled = true;
    var prefixedLogger = logger.createPrefixedLogger('test identifier');

    expect(prefixedLogger.log).toEqual(jasmine.any(Function));
    expect(prefixedLogger.info).toEqual(jasmine.any(Function));
    expect(prefixedLogger.warn).toEqual(jasmine.any(Function));
    expect(prefixedLogger.error).toEqual(jasmine.any(Function));

    prefixedLogger.log('test message');
    expect(window.console.log).toHaveBeenCalledWith(messagePrefix +
      ' [test identifier] test message');
  });
});
