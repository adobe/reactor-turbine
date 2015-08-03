var SATELLITE_KEY = '__satellite__';
var stashIdIncrementor = 0;

module.exports = function(name) {
  var stashId = (name ? name + '-' : '') + stashIdIncrementor++;

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
