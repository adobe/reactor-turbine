var each = require('./utils/public/each');

/**
 * Retrieves a list of extension types in the order they should be instantiated.
 *
 * @param {Array} extensionsMeta Array of extension metadata objects where extension.dependencies
 * is an array of extension types that are required dependencies of the extension.
 * @returns {Array} A list of extension types in the order they should be instantiated in order
 * to fulfill dependency requirements. If A is dependent on B and B is dependent on C, the
 * returned array will be C, B, A.
 */
function getOrderedExtensionTypes(extensionsMeta) {
  var orderedTypes = [];

  function addToOrderedTypes(type, extensionMeta) {
    if (orderedTypes.indexOf(type) !== -1) {
      return;
    }

    // If the extension has dependencies add those dependencies to the list first.
    if (extensionMeta.dependencies && extensionMeta.dependencies.length) {
      each(extensionMeta.dependencies, function(dependencyType) {
        addToOrderedTypes(dependencyType, extensionsMeta[dependencyType]);
      })
    }

    orderedTypes.push(type);
  }

  for (var type in extensionsMeta) {
    addToOrderedTypes(type, extensionsMeta[type]);
  }

  return orderedTypes;
}

/**
 * Instantiates extensions while injecting dependency extensions instances.
 * @param {Object} propertyMeta Property metadata object.
 * @returns {Object} Object where the key is the instance ID and the value is the instance.
 */
module.exports = function(propertyMeta, extensionInstanceRegistry) {
  // Get the order in which extensions need to be instantiated in order to inject extension
  // instances into other extension instances that depend on them.
  var extensionTypes = getOrderedExtensionTypes(propertyMeta.extensions);

  each(extensionTypes, function(extensionType) {
    var extensionMeta = propertyMeta.extensions[extensionType];

    var dependencies = extensionMeta.dependencies ?
        extensionInstanceRegistry.getMappedByType(extensionMeta.dependencies) : {};

    var extensionFactory = extensionMeta.script(propertyMeta.settings || {}, dependencies);

    for (var extensionInstanceId in propertyMeta.extensionInstances) {
      var extensionInstanceMeta = propertyMeta.extensionInstances[extensionInstanceId];
      if (extensionInstanceMeta.type === extensionType) {
        var extensionInstance = extensionFactory(extensionInstanceMeta.settings || {});
        extensionInstanceRegistry.register(extensionInstanceId, extensionType, extensionInstance);
      }
    }
  });
};
