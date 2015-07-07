var dataElementDefinitions = require('../../stores/dataElementDefinitions');
var dataElementDelegates = require('../../stores/extensionDelegates/dataElementDelegates');
var dataElementSafe = require('../../stores/dataElementSafe');
var cleanText = require('./../string/cleanText');

module.exports = function(variable, suppressDefault, dataDef) {
  dataDef = dataDef || dataElementDefinitions.getByName(variable);
  var storeLength = dataDef.config.storeLength;

  var delegate = dataElementDelegates.get(dataDef.type);
  var value = delegate(dataDef.config);

  // TODO: Move this to data element delegates?
  if (dataDef.config.cleanText) {
    value = cleanText(value);
  }

  if (value === undefined && storeLength) {
    value = dataElementSafe(variable, storeLength);
  } else if (value !== undefined && storeLength) {
    dataElementSafe(variable, storeLength, value);
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
