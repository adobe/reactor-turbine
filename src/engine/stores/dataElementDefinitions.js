var forEach = require('../utils/forEach');
var definitionsByName = {};

module.exports = {
  init: function(definitions) {
    forEach(definitions, function(definition) {
      // Prefix with $ to avoid important Object properties from being masked (e.g., "prototype").
      definitionsByName['$' + definition.name] = definition;
    });
  },
  getByName: function(name) {
    return definitionsByName['$' + name];
  }
};
