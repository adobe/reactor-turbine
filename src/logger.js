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

/**
 * Log levels.
 * @readonly
 * @enum {string}
 * @private
 */
var levels = {
  LOG: 'log',
  INFO: 'info',
  DEBUG: 'debug',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Rocket unicode surrogate pair.
 * @type {string}
 */
var ROCKET = '\uD83D\uDE80';

/**
 * The user's internet explorer version. If they're not running internet explorer, then it should
 * be NaN.
 * @type {Number}
 */
var ieVersion = parseInt(
  (/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]
);

/**
 * Prefix to use on all messages. The rocket unicode doesn't work on IE 10.
 * @type {string}
 */
var launchPrefix = ieVersion === 10 ? '[Launch]' : ROCKET;

/**
 * Whether logged messages should be output to the console.
 * @type {boolean}
 */
var outputEnabled = false;

/**
 * Maximum number of deduplicated deprecation messages to hold when outputEnabled is false.
 * This bounds memory usage.
 * @type {number}
 */
var MAX_DEPRECATION_CACHE_SIZE = 100;

/**
 * Set to track deduplicated deprecation messages when outputEnabled is false.
 * @type {Set<string>}
 */
var dedupDeprecationMessages = new Set();

/**
 * Processes a log message.
 * @param {string} level The level of message to log.
 * @param {...*} arg Any argument to be logged.
 * @private
 */
var process = function (level) {
  if (outputEnabled && window.console) {
    var logArguments = Array.prototype.slice.call(arguments, 1);
    logArguments.unshift(launchPrefix);
    // window.debug is unsupported in IE 10
    if (level === levels.DEBUG && !window.console[level]) {
      level = levels.INFO;
    }
    window.console[level].apply(window.console, logArguments);
  }
};

/**
 * Outputs a message to the web console.
 * @param {...*} arg Any argument to be logged.
 */
var log = process.bind(null, levels.LOG);

/**
 * Outputs informational message to the web console.
 * @param {...*} arg Any argument to be logged.
 */
var info = process.bind(null, levels.INFO);

/**
 * Outputs debug message to the web console.
 * In browsers that do not support console.debug, console.info is used instead.
 * @param {...*} arg Any argument to be logged.
 */
var debug = process.bind(null, levels.DEBUG);

/**
 * Outputs a warning message to the web console.
 * @param {...*} arg Any argument to be logged.
 */
var warn = process.bind(null, levels.WARN);

/**
 * Outputs an error message to the web console.
 * @param {...*} arg Any argument to be logged.
 */
var error = process.bind(null, levels.ERROR);

/**
 * Outputs a deprecation warning to the web console.
 * Deduplicates messages when output is disabled.
 * Passes all through when output is enabled.
 * @param {string} message The deprecation message.
 * @param {...*} additionalArgs Additional optional args.
 */
var logDeprecation = function () {
  var message = arguments[0];

  if (typeof message !== 'string') {
    message = String(message);
  }

  // Always log when output is enabled
  if (outputEnabled) {
    process.apply(
      null,
      [levels.WARN].concat(Array.prototype.slice.call(arguments))
    );
    return;
  }

  // When output is disabled: only log first time per unique message
  if (!dedupDeprecationMessages.has(message)) {
    dedupDeprecationMessages.add(message);

    // Maintain bounded size
    if (dedupDeprecationMessages.size > MAX_DEPRECATION_CACHE_SIZE) {
      var first = dedupDeprecationMessages.values().next().value;
      dedupDeprecationMessages.delete(first);
    }

    // Log even though outputEnabled is false (just once per unique message)
    var wasEnabled = outputEnabled;
    outputEnabled = true;
    process.apply(
      null,
      [levels.WARN].concat(Array.prototype.slice.call(arguments))
    );
    outputEnabled = wasEnabled;
  }

  // Already logged → suppress
};

// Build the module exports object
var loggerExports = {
  log: log,
  info: info,
  debug: debug,
  warn: warn,
  error: error,
  deprecation: logDeprecation,

  /**
   * Creates a logging utility that only exposes logging functionality and prefixes all messages
   * with an identifier.
   */
  createPrefixedLogger: function (identifier) {
    var loggerSpecificPrefix = '[' + identifier + ']';

    return {
      log: log.bind(null, loggerSpecificPrefix),
      info: info.bind(null, loggerSpecificPrefix),
      debug: debug.bind(null, loggerSpecificPrefix),
      warn: warn.bind(null, loggerSpecificPrefix),
      error: error.bind(null, loggerSpecificPrefix)
    };
  }
};

// Define outputEnabled getter/setter with deduplication flush behavior
Object.defineProperty(loggerExports, 'outputEnabled', {
  get: function () {
    return outputEnabled;
  },
  set: function (value) {
    if (outputEnabled === false && value === true) {
      // Flush deduplication set on enable
      dedupDeprecationMessages.clear();
    }
    outputEnabled = value;
  },
  enumerable: true,
  configurable: true
});

module.exports = loggerExports;
