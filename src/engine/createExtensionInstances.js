var each = require('./utils/public/each');

function getOrderedExtensionTypes(extensions) {
  var orderedTypes = [];

  function addToOrderedTypes(type, extension) {
    if (orderedTypes.indexOf(type) !== -1) {
      return;
    }

    if (extension.dependencies && extension.dependencies.length) {
      each(extension.dependencies, function(dependencyType) {
        addToOrderedTypes(dependencyType, extensions[dependencyType]);
      })
    }

    orderedTypes.push(type);
  }

  for (var type in extensions) {
    addToOrderedTypes(type, extensions[type]);
  }

  return orderedTypes;
}

module.exports = function(propertyMeta) {
  var instanceById = {};
  var instancesByExtensionType = {};

  var extensionTypes = getOrderedExtensionTypes(propertyMeta.extensions);

  each(extensionTypes, function(extensionType) {
    var extensionMeta = propertyMeta.extensions[extensionType];
    var extensionInstances = [];

    for (var extensionInstanceId in propertyMeta.extensionInstances) {
      var extensionInstanceMeta = propertyMeta.extensionInstances[extensionInstanceId];
      if (extensionInstanceMeta.type === extensionType) {
        var dependencyInstances = {};

        if (extensionMeta.dependencies) {
          each(extensionMeta.dependencies, function(dependencyExtensionType) {
            dependencyInstances[dependencyExtensionType] = instancesByExtensionType[dependencyExtensionType];
          });
        }

        var Extension = extensionMeta.script();
        var extensionInstance = new Extension(
            propertyMeta,
            extensionInstanceMeta.settings,
            dependencyInstances);

        instanceById[extensionInstanceId] = extensionInstance;
        extensionInstances.push(extensionInstance);
      }
    }

    instancesByExtensionType[extensionType] = extensionInstances;
  });

  return instanceById;
};
