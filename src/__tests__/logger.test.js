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

    prefixedLogger.log('test log message');
    expect(window.console.log).toHaveBeenCalledWith(messagePrefix +
      ' [test identifier] test log message');

    prefixedLogger.info('test info message');
    expect(window.console.info).toHaveBeenCalledWith(messagePrefix +
      ' [test identifier] test info message');

    prefixedLogger.warn('test warn message');
    expect(window.console.warn).toHaveBeenCalledWith(messagePrefix +
      ' [test identifier] test warn message');

    prefixedLogger.error('test error message');
    expect(window.console.error).toHaveBeenCalledWith(messagePrefix +
      ' [test identifier] test error message');
  });

  it('returns outputEnabled value', function() {
    logger.outputEnabled = true;
    expect(logger.outputEnabled).toBe(true);
  });
});
