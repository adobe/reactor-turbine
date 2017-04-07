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
var LEVELS = {
  LOG: 'log',
  INFO: 'info',
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
var ieVersion = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

/**
 * Prefix to use on all messages. The rocket unicode doesn't work on IE 9 and 10.
 * @type {string}
 */
var messagePrefix = ieVersion === 9 || ieVersion === 10 ? '[Launch]' : ROCKET;

/**
 * History of logged entries capped to a max. Note that while this is private it is accessed
 * by end-to-end tests.
 * @private
 */
var history = [];

/**
 * The maximum number of log entries to retain in the history.
 * @private
 */
var maxHistory = 100;

/**
 * Whether logged messages should be output to the console. When set to true, all messages saved
 * in the logging history that have not been previously output to the console will be immediately
 * output to the console.
 * @type {boolean}
 */
var outputEnabled = false;

/**
 * Flushes a log entry to the web console.
 * @param {Object} entry
 * @private
 */
var flushEntry = function(entry) {
  if (!entry.flushed) {
    if (window.console) {

      window.console[entry.level](messagePrefix + ' ' + entry.message);
    }
    entry.flushed = true;
  }
};

/**
 * Flushes all stored log entries to the web console if they have not been flushed previously.
 * @private
 */
var flushHistory = function() {
  history.forEach(flushEntry);
};

/**
 * Processes a log message.
 * @param {string} message The message to log.
 * @param level
 * @private
 */
var process = function(message, level) {
  var entry = {
    message: message,
    level: level,
    flushed: false
  };

  history.push(entry);

  if (history.length > maxHistory) {
    history.shift();
  }

  if (outputEnabled) {
    flushEntry(entry);
  }
};

/**
 * Prefixes messages with a prefix wrapped in square brackets.
 * @param {String} prefix A prefix for the message.
 * @param {String} message The message that should be prefixed.
 * @returns {string} Prefixed message.
 */
var prefixWithBrackets = function(prefix, message) {
  return '[' + prefix + '] ' + message;
};

/**
 * Outputs a message to the web console.
 * @param {String} message The message to output.
 */
var log = function(message) {
  process(message, LEVELS.LOG);
};

/**
 * Outputs informational message to the web console. In some browsers a small "i" icon is
 * displayed next to these items in the web console's log.
 * @param {String} message The message to output.
 */
var info = function(message) {
  process(message, LEVELS.INFO);
};

/**
 * Outputs a warning message to the web console.
 * @param {String} message The message to output.
 */
var warn = function(message) {
  process(message, LEVELS.WARN);
};

/**
 * Outputs an error message to the web console.
 * @param {String} message The message to output.
 */
var error = function(message) {
  process(message, LEVELS.ERROR);
};

module.exports = {
  log: log,
  info: info,
  warn: warn,
  error: error,
  /**
   * Whether logged messages should be output to the console. When set to true, all messages saved
   * in the logging history that have not been previously output to the console will be immediately
   * output to the console.
   * @type {boolean}
   */
  get outputEnabled() {
    return outputEnabled;
  },
  set outputEnabled(value) {
    if (outputEnabled === value) {
      return;
    }

    outputEnabled = value;

    if (value) {
      flushHistory();
    }
  },
  /**
   * Creates a logging utility that only exposes logging functionality and prefixes all messages
   * with an identifier.
   */
  createPrefixedLogger: function(identifier) {
    return {
      log: function(message) {
        log(prefixWithBrackets(identifier, message));
      },
      info: function(message) {
        info(prefixWithBrackets(identifier, message));
      },
      warn: function(message) {
        warn(prefixWithBrackets(identifier, message));
      },
      error: function(message) {
        error(prefixWithBrackets(identifier, message));
      }
    };
  }
};
