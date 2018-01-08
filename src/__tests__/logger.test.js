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

var launchPrefix = ieVersion === 10 ? '[Launch]' : ROCKET;

describe('logger', function() {
  var STANDARD_LOG_METHODS = ['log', 'info', 'warn', 'error'];

  beforeEach(function() {
    spyOn(window.console, 'log');
    spyOn(window.console, 'info');
    spyOn(window.console, 'warn');
    spyOn(window.console, 'error');
  });

  STANDARD_LOG_METHODS.forEach(function(fnName) {
    it('logs args when output is enabled and ' + fnName + ' is called', function() {
      logger.outputEnabled = true;
      var calls = window.console[fnName].calls;
      var arg1 = {};
      var arg2 = {};
      logger[fnName](arg1, arg2);
      expect(calls.count()).toBe(1);
      expect(calls.argsFor(0)[0]).toBe(launchPrefix, arg1, arg2);
    });

    it('does not log args when output is disabled and ' + fnName + ' is called', function() {
      logger.outputEnabled = false;
      var calls = window.console[fnName].calls;
      var arg1 = {};
      var arg2 = {};
      logger[fnName](arg1, arg2);
      expect(calls.count()).toBe(0);
    });

    it('creates a prefixed logger with functional ' + fnName + ' method', function() {
      logger.outputEnabled = true;
      var id = 'test identifier';
      var bracketId = '[' + id + ']';
      var prefixedLogger = logger.createPrefixedLogger(id);

      expect(prefixedLogger[fnName]).toEqual(jasmine.any(Function));

      var arg1 = {};
      var arg2 = {};

      prefixedLogger[fnName](arg1, arg2);
      expect(window.console[fnName]).toHaveBeenCalledWith(launchPrefix, bracketId, arg1, arg2);
    });
  });

  it('returns outputEnabled value', function() {
    // A getter/setter pair is used for outputEnabled. This ensures we're testing both.
    logger.outputEnabled = true;
    expect(logger.outputEnabled).toBe(true);
    logger.outputEnabled = false;
    expect(logger.outputEnabled).toBe(false);
  });
});
