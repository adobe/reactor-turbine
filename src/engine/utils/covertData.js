var SATELLITE_KEY = '__satellite__covert';
var caches = {};
var cacheId = 0;

/**
 * Store and retrieve arbitrary data associated with a particular object. This arbitrary data is
 * stored within a __satellite__ attribute on the object. It is similar to jquery's data method
 * {@link https://api.jquery.com/jquery.data/}.
 *
 * @param {Object} object The object to store the data on or retrieve the data from. This may be an
 * HTML element.
 * @param {string} key The string naming the piece of data to set.
 * @param {*} [value] The new data value. If undefined, the data for the specified key will be
 * returned.
 * @returns {*}
 */
module.exports = function(object, key, value) {
  var uuid = object[SATELLITE_KEY];
  if (!uuid) {
    uuid = object[SATELLITE_KEY] = cacheId++;
  }
  var cache = caches[uuid];
  if (!cache) {
    cache = caches[uuid] = {};
  }
  if (value === undefined) {
    return cache[key];
  } else {
    cache[key] = value;
  }
};
