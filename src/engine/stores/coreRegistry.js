var coreById = {};

/**
 * Stores extension cores.
 */
module.exports = {
  register: function(extensionId, instance) {
    coreById[extensionId] = instance;
  },
  get: function(id) {
    return coreById[id];
  }
};
