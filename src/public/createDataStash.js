var STORAGE_KEY = '__turbine__';
var stashIdIncrementor = 0;

/**
 * Creates a data stash used to store arbitrary data on an object (typically a DOM element). The
 * data is stored under a __turbine__ property on the object. Data stored using a given data
 * stash is isolated from data stored through other data stashes.
 *
 * @param {string} [name] The name of the data stash. If defined, this becomes part of
 * the unique key used for storing the stash's data on the object. The stash will be unique
 * regardless of whether the name is unique. Having the unique key include a name can be useful
 * when debugging the object to determine which stash a piece of data came from.
 * @returns {Function}
 */
module.exports = function(name) {
  var stashId = (name ? name + '-' : '') + stashIdIncrementor++;

  /**
   * Retrieves the data stash for the given object.
   *
   * @param {Object} object The object from which the data stash should be retrieved.
   */
  return function(object) {
    var stashByStashId = object[STORAGE_KEY];

    if (!stashByStashId) {
      stashByStashId = object[STORAGE_KEY] = {};
    }

    var stash = stashByStashId[stashId];

    if (!stash) {
      stash = stashByStashId[stashId] = {};
    }

    return stash;
  };
};
