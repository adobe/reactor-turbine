/**
 * Logging utility. When output is enabled, messages will be logged to the console.
 */
module.exports = {
  /**
   * History of logged entries capped to a max. Note that while this is private it is accessed
   * by end-to-end tests.
   * @private
   */
  _history: [],

  /**
   * The maximum number of log entries to retain in the history.
   * @private
   */
  _maxHistory: 100,

  /**
   * Log levels.
   * @readonly
   * @enum {string}
   * @private
   */
  _levels: {
    LOG: 'log',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
  },

  /**
   * Flushes a log entry to the web console.
   * @param {Object} entry
   * @private
   */
  _flushEntry: function(entry) {
    if (!entry.flushed) {
      if (window.console) {
        window.console[entry.level]('SATELLITE: ' + entry.message);
      }
      entry.flushed = true;
    }
  },

  /**
   * Flushes all stored log entries to the web console if they have not been flushed previously.
   * @private
   */
  _flushHistory: function() {
    this._history.forEach(this._flushEntry);
  },

  /**
   * Processes a log message.
   * @param {string} message The message to log.
   * @param level
   * @private
   */
  _process: function(message, level) {
    var entry = {
      message: message,
      level: level,
      flushed: false
    };

    this._history.push(entry);

    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }

    if (this._outputEnabled) {
      this._flushEntry(entry);
    }
  },

  /**
   * Log a message. This method is exposed to users as _satellite.notify().
   * @param {string} message The message to log.
   * @param {number} [level] A number that represents the level of logging.
   * 3=info, 4=warn, 5=error, anything else=log
   */
  notify: function(message, level) {
    var mappedLevel;
    switch (level) {
      // The info starts at 3 due to legacy baggage. These are integers rather than this._levels
      // enumeration values also due to legacy baggage.
      case 3:
        mappedLevel = this._levels.INFO;
        break;
      case 4:
        mappedLevel = this._levels.WARN;
        break;
      case 5:
        mappedLevel = this._levels.ERROR;
        break;
      default:
        mappedLevel = this._levels.LOG;
    }
    this._process(message, mappedLevel);
  },

  /**
   * Outputs a message to the web console.
   * @param {String} message The message to output.
   */
  log: function(message) {
    this._process(message, this._levels.LOG);
  },

  /**
   * Outputs informational message to the web console. In some browsers a small "i" icon is
   * displayed next to these items in the web console's log.
   * @param {String} message The message to output.
   */
  info: function(message) {
    this._process(message, this._levels.INFO);
  },

  /**
   * Outputs a warning message to the web console.
   * @param {String} message The message to output.
   */
  warn: function(message) {
    this._process(message, this._levels.WARN);
  },

  /**
   * Outputs an error message to the web console.
   * @param {String} message The message to output.
   */
  error: function(message) {
    this._process(message, this._levels.ERROR);
  },

  _outputEnabled: false,
  /**
   * Whether logged messages should be output to the console. When set to true, all messages saved
   * in the logging history that have not been previously output to the console will be immediately
   * output to the console.
   * @type {boolean}
   */
  get outputEnabled() {
    return this._outputEnabled;
  },
  set outputEnabled(value) {
    if (this._outputEnabled === value) {
      return;
    }

    this._outputEnabled = value;

    if (value) {
      this._flushHistory();
    }
  }
};
