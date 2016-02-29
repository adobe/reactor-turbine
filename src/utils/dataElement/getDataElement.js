var state = require('../../state');
var cleanText = require('./../string/cleanText');

module.exports = function(name, suppressDefault) {
  var dataDef = state.getDataElementDefinition(name);

  if (!dataDef) {
    return state.getPropertySettings().undefinedVarsReturnEmpty ? '' : null;
  }

  var storeLength = dataDef.settings.storeLength;
  var delegate = state.getDelegate(dataDef.delegateId);
  var value = delegate.exports(dataDef.settings);

  if (dataDef.settings.cleanText) {
    value = cleanText(value);
  }

  if (value === undefined && storeLength) {
    value = state.getCachedDataElement(name, storeLength);
  } else if (value !== undefined && storeLength) {
    state.cacheDataElement(name, storeLength, value);
  }

  if (value === undefined && !suppressDefault) {
    // Have to wrap "default" in quotes since it is a keyword.
    /*eslint-disable dot-notation*/
    value = dataDef.settings['default'] || '';
    /*eslint-enable dot-notation*/
  }

  if (dataDef.settings.forceLowerCase && value.toLowerCase) {
    value = value.toLowerCase();
  }

  return value;
};
