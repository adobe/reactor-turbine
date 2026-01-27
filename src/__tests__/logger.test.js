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

var ieVersion = parseInt(
  (/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]
);

var launchPrefix = ieVersion === 10 ? '[Launch]' : ROCKET;

describe('logger', function () {
  var STANDARD_LOG_METHODS = ['log', 'info', 'debug', 'warn', 'error'];

  beforeEach(function () {
    spyOn(window.console, 'log');
    spyOn(window.console, 'info');

    if (ieVersion !== 10) {
      spyOn(window.console, 'debug');
    }

    spyOn(window.console, 'warn');
    spyOn(window.console, 'error');
  });

  STANDARD_LOG_METHODS.forEach(function (loggerMethodName) {
    var consoleMethodName =
      loggerMethodName === 'debug' && ieVersion === 10
        ? 'info'
        : loggerMethodName;

    it(
      'logs args when output is enabled and ' + loggerMethodName + ' is called',
      function () {
        logger.outputEnabled = true;
        var calls = window.console[consoleMethodName].calls;
        var arg1 = {};
        var arg2 = {};
        logger[loggerMethodName](arg1, arg2);
        expect(calls.count()).toBe(1);
        expect(calls.argsFor(0)[0]).toBe(launchPrefix, arg1, arg2);
      }
    );

    it(
      'does not log args when output is disabled and ' +
        loggerMethodName +
        ' is called',
      function () {
        logger.outputEnabled = false;
        var calls = window.console[consoleMethodName].calls;
        var arg1 = {};
        var arg2 = {};
        logger[loggerMethodName](arg1, arg2);
        expect(calls.count()).toBe(0);
      }
    );

    it(
      'creates a prefixed logger with functional ' +
        loggerMethodName +
        ' method',
      function () {
        logger.outputEnabled = true;
        var id = 'test identifier';
        var bracketId = '[' + id + ']';
        var prefixedLogger = logger.createPrefixedLogger(id);

        expect(prefixedLogger[loggerMethodName]).toEqual(jasmine.any(Function));

        var arg1 = {};
        var arg2 = {};

        prefixedLogger[loggerMethodName](arg1, arg2);
        expect(window.console[consoleMethodName]).toHaveBeenCalledWith(
          launchPrefix,
          bracketId,
          arg1,
          arg2
        );
      }
    );
  });

  it('returns outputEnabled value', function () {
    // A getter/setter pair is used for outputEnabled. This ensures we're testing both.
    logger.outputEnabled = true;
    expect(logger.outputEnabled).toBe(true);
    logger.outputEnabled = false;
    expect(logger.outputEnabled).toBe(false);
  });

  describe('logger.deprecation', function () {
    it('logs deprecations to the console when logger.outputEnabled=true', function () {
      var message = '_satellite.deprecatedFeature is officially deprecated';
      logger.outputEnabled = true;
      logger.deprecation(message);

      expect(window.console.warn).toHaveBeenCalledWith(launchPrefix, message);
      expect(logger.outputEnabled).toBeTrue();
    });

    it('logs deprecations to the console when logger.outputEnabled=false', function () {
      var message = '_satellite.deprecatedFeature is officially deprecated';
      logger.outputEnabled = false;
      logger.deprecation(message);

      expect(window.console.warn).toHaveBeenCalledWith(launchPrefix, message);
      expect(logger.outputEnabled).toBeFalse();
    });

    it('always logs deprecations when outputEnabled is true (no deduplication)', function () {
      var message = '_satellite.someDeprecatedThing';
      logger.outputEnabled = true;

      logger.deprecation(message);
      logger.deprecation(message);

      expect(window.console.warn.calls.count()).toBe(2);
      expect(window.console.warn.calls.argsFor(0)).toEqual([
        launchPrefix,
        message
      ]);
      expect(window.console.warn.calls.argsFor(1)).toEqual([
        launchPrefix,
        message
      ]);
    });

    it('logs deprecation only once when outputEnabled is false, then suppresses', function () {
      var message = '_satellite.anotherDeprecatedThing';
      logger.outputEnabled = false;

      logger.deprecation(message); // should log
      logger.deprecation(message); // should be suppressed

      expect(window.console.warn.calls.count()).toBe(1);
      expect(window.console.warn).toHaveBeenCalledWith(launchPrefix, message);
    });

    it('evicts oldest deprecation messages when deduplication cache is full', function () {
      logger.outputEnabled = false;

      var total = 105; // Exceed cache limit (default 100)
      var oldMessage = '_satellite.oldDeprecatedThing';

      // Fill cache with unique messages
      for (var i = 0; i < total; i++) {
        logger.deprecation('_satellite.deprecated' + i);
      }

      // Cache should evict oldest (index 0)
      logger.deprecation(oldMessage); // first time -> should log
      logger.deprecation(oldMessage); // second time -> should be suppressed

      expect(window.console.warn).toHaveBeenCalledWith(
        launchPrefix,
        oldMessage
      );
      expect(window.console.warn.calls.count()).toBe(total + 1); // 105 unique + 1 old message
    });

    it('evicts the oldest deprecation message when deduplication cache exceeds limit', function () {
      logger.outputEnabled = false;

      var max = 100; // Assuming MAX_DEPRECATION_CACHE_SIZE = 100
      var oldestMessage = '_satellite.oldestMessage';

      // Log the oldest message first
      logger.deprecation(oldestMessage);

      // Log (max) other unique messages to fill the cache
      for (var i = 0; i < max; i++) {
        logger.deprecation('_satellite.newMessage' + i);
      }

      // At this point, the oldestMessage should have been evicted (FIFO policy)
      // because we logged (max + 1) unique messages and the cache size is capped at 100

      // Now log oldestMessage again — it should go through again (was evicted)
      logger.deprecation(oldestMessage);

      // Total expected:
      // 1st call to oldestMessage logs
      // 100 new unique messages log
      // 2nd call to oldestMessage logs again (after eviction)
      expect(window.console.warn.calls.count()).toBe(max + 2);

      // Confirm that oldestMessage was logged *twice*
      const callsWithOldest = window.console.warn.calls
        .all()
        .filter((call) => call.args[1] === oldestMessage);
      expect(callsWithOldest.length).toBe(2);
    });

    it('coerces non-string deprecation messages and deduplicates based on string form', function () {
      logger.outputEnabled = false;

      var nonStringMessage = { toString: () => 'custom-toString' };

      logger.deprecation(nonStringMessage); // should log
      logger.deprecation(nonStringMessage); // should be suppressed

      expect(window.console.warn.calls.count()).toBe(1);
      expect(window.console.warn).toHaveBeenCalledWith(
        launchPrefix,
        jasmine.stringMatching('custom-toString')
      );
    });

    it('preserves outputEnabled state after logging with it temporarily set to true', function () {
      var message = '_satellite.deprecatedPreserve';

      logger.outputEnabled = false;
      logger.deprecation(message);

      expect(logger.outputEnabled).toBeFalse(); // Make sure it didn’t flip to true
    });

    it(
      'flushes the deprecation deduplication buffer when outputEnabled is set ' +
        'to true, allowing repeated messages to log again',
      function () {
        var msg1 = '_satellite.deprecatedFeature1';
        var msg2 = '_satellite.deprecatedFeature2';

        // Start with output disabled: deduplication is active.
        logger.outputEnabled = false;

        // Log two distinct messages. Both should be logged (first-time).
        logger.deprecation(msg1);
        logger.deprecation(msg2);

        // Log duplicates of the same messages. These should be suppressed due to deduplication.
        logger.deprecation(msg1);
        logger.deprecation(msg2);

        // Only the first occurrences should have caused console.warn calls.
        expect(window.console.warn.calls.count()).toBe(2);

        // Enable output: this action should flush the deduplication buffer internally.
        logger.outputEnabled = true;

        // Disable output again to reactivate deduplication.
        logger.outputEnabled = false;

        // Now log the same messages again.
        // Since the buffer was cleared on enabling output,
        // these should log again (not be suppressed).
        logger.deprecation(msg1);
        logger.deprecation(msg2);

        // Total console.warn calls should be 4:
        // - 2 from first calls (before buffer flush)
        // - 2 from calls after buffer flush (duplicates allowed again)
        expect(window.console.warn.calls.count()).toBe(4);
      }
    );
  });

  it(
    'does not suppress duplicate log calls for info, warn, error, log, ' +
      'and debug when outputEnabled is true',
    function () {
      logger.outputEnabled = true;

      var message = 'Repeated message';
      var methods = ['info', 'warn', 'error', 'log', 'debug'];

      methods.forEach(function (methodName) {
        var spy = window.console[methodName];
        spy.calls.reset();

        logger[methodName](message);
        logger[methodName](message);

        expect(spy.calls.count()).toBe(
          2,
          methodName + ' should not suppress duplicate calls'
        );
        expect(spy.calls.argsFor(0)).toEqual([launchPrefix, message]);
        expect(spy.calls.argsFor(1)).toEqual([launchPrefix, message]);
      });
    }
  );
});
