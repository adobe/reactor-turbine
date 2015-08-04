var SATELLITE_KEY = '__satellite__';
var stashIdIncrementor = 0;

/**
 * Creates a data stash used to store arbitrary data on an object (typically a DOM element). The
 * data is stored under a __satellite__ property on the object. Data stored using a given data
 * stash is isolated from data stored through other data stashes.
 *
 * @param {string} [name] The name of the data stash. If defined, this becomes part of
 * the unique key used for storing the stash's data on the object. This can be useful when
 * debugging the object to determine which stash a piece of data came from.
 * @returns {Function}
 */
module.exports = function(name) {
  var stashId = (name ? name + '-' : '') + stashIdIncrementor++;

  /**
   * Stores or retrieves a data value on the specified object. When retrieving data, only data
   * that was stored using the same data stash instance will be returnable.
   *
   * @param {Object} object The object which the data value should be stored to/from.
   * @param {String} key The string naming the piece of data to retrieve or store.
   * @param {*} [value] The new data value. When passed, the value will be set. When not passed,
   * the value will be retrieved.
   */
  return function(object, key, value) {
    var stashByStashId = object[SATELLITE_KEY];

    if (!stashByStashId) {
      stashByStashId = object[SATELLITE_KEY] = Object.create(null);
    }

    var stash = stashByStashId[stashId];

    if (!stash) {
      stash = stashByStashId[stashId] = Object.create(null);
    }

    if (arguments.length === 3) {
      stash[key] = value;
    } else {
      return stash[key];
    }
  };
};
