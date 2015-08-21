
module.exports = function(definitions) {
  var definitionsByName = Object.create(null);

  if (definitions) {
    definitions.forEach(function(definition) {
      definitionsByName[definition.name] = definition;
    });
  }

  return function(name) {
    return definitionsByName[name];
  };
};
