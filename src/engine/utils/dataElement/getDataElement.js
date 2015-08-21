var state = require('../../state');
var cleanText = require('./../string/cleanText');

module.exports = function(variable, suppressDefault, dataDef) {
  dataDef = dataDef || state.getDataElementDefinition(variable);
  var storeLength = dataDef.config.storeLength;

  var delegate = state.getDataElementDelegate(dataDef.type);
  var value = delegate(dataDef.config);

  // TODO: Move this to data element delegates?
  if (dataDef.config.cleanText) {
    value = cleanText(value);
  }

  if (value === undefined && storeLength) {
    value = state.getDataElement(variable, storeLength);
  } else if (value !== undefined && storeLength) {
    state.setDataElement(variable, storeLength, value);
  }
  if (value === undefined && !suppressDefault) {
    // Have to wrap "default" in quotes since it is a keyword.
    /*eslint-disable dot-notation*/
    value = dataDef.config['default'] || '';
    /*eslint-enable dot-notation*/
  }

  // TODO: Move this to data element delegates?
  if (dataDef.config.forceLowerCase && value.toLowerCase) {
    value = value.toLowerCase();
  }
  return value;
};
