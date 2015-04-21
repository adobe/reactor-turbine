var instancesByType = {};
var instanceById = {};

function getByWhitelist(source, whitelist) {
  var dest = {};
  for (var key in source) {
    if (!whitelist || whitelist.indexOf(key) !== -1) {
      dest[key] = source[key];
    }
  }
  return dest;
}

module.exports = {
  register: function(id, type, instance) {
    instanceById[id] = instance;

    var typeInstances = instancesByType[type];

    if (!typeInstances) {
      typeInstances = instancesByType[type] = [];
    }

    typeInstances.push(instance);
  },
  getById: function(id) {
    return instanceById[id];
  },
  getByType: function(type) {
    return instancesByType[type] || [];
  },
  getMappedById: function(whitelistIds) {
    return whitelistIds ? getByWhitelist(instanceById, whitelistIds) : instanceById;
  },
  getMappedByType: function(whitelistTypes) {
    return whitelistTypes ? getByWhitelist(instancesByType, whitelistTypes) : instancesByType;
  }
};
