var each = require('../utils/public/each');
var definitionsByName = {};
module.exports = {
  add: function(definitions) {
    each(definitions, function(definition) {
      // Prefix with $ to avoid important Object properties from being masked (e.g., "prototype").
      definitionsByName['$' + definition.name] = definition;
    });
  },
  getByName: function(name) {
    return definitionsByName['$' + name];
  }
};
