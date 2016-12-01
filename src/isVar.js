var state = require('./state');

// isVar(variableName)
// ==========================
//
// Determines if the provided name is a valid variable, where the variable
// can be a data element, defined in the "data" section
// of the initial config, or reference properties on
// an element, event, or target of the event in question,
// a query parameter, or a random number.
//
// - `variableName` - the name of the variable to get
module.exports = function(variableName) {
  var nameBeforeDot = variableName.split('.')[0];

  return Boolean(
    variableName === 'URI' ||
    variableName === 'uri' ||
    variableName === 'protocol' ||
    variableName === 'hostname' ||
    state.getDataElementDefinition(variableName) ||
    nameBeforeDot === 'this' ||
    nameBeforeDot === 'event' ||
    nameBeforeDot === 'target' ||
    nameBeforeDot === 'window' ||
    nameBeforeDot === 'param' ||
    nameBeforeDot.match(/^rand([0-9]+)$/) ||
    state.customVars.hasOwnProperty(nameBeforeDot)
  );
};
