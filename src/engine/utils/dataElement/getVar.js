var getObjectProperty = require('./getObjectProperty');
var customVars = require('../../stores/customVars');
var dataElementDefinitions = require('../../stores/dataElementDefinitions');
var getDataElement = require('./getDataElement');
var getURI = require('./../uri/getURI');
var getQueryParam = require('./../uri/getQueryParam');

// getVar(variable, elm, evt)
// ==========================
//
// Return the value of a variable, where the variable
// can be a data element, defined in the "data" section
// of the initial config, or reference properties on
// an element, event, or target of the event in question,
// a query parameter, or a random number.
//
// - `variable` - the name of the variable to get
// - `[element]` - the associated element, if any
// - `[event]` - the associated event, if any
module.exports = function(variable, element, event) {
  var URI = getURI();
  var randMatch;
  var value;
  var map = {
    URI: URI,
    uri: URI,
    protocol: document.location.protocol,
    hostname: document.location.hostname
  };
  if (dataElementDefinitions.getByName(variable)) {
    return getDataElement(variable);
  }
  value = map[variable];
  if (value === undefined) {
    if (variable.substring(0, 5) === 'this.') {
      if (element) {
        variable = variable.slice(5);
        value = getObjectProperty(element, variable, true);
      }
    } else if (variable.substring(0, 6) === 'event.') {
      if (event) {
        variable = variable.slice(6);
        value = getObjectProperty(event, variable);
      }
    } else if (variable.substring(0, 7) === 'target.') {
      if (event.target) {
        variable = variable.slice(7);
        value = getObjectProperty(event.target, variable);
      }
    } else if (variable.substring(0, 7) === 'window.') {
      variable = variable.slice(7);
      value = getObjectProperty(window, variable);
    } else if (variable.substring(0, 6) === 'param.') {
      variable = variable.slice(6);
      value = getQueryParam(variable);
    } else {
      randMatch = variable.match(/^rand([0-9]+)$/);
      if (randMatch) {
        var len = Number(randMatch[1]);
        var s = (Math.random() * (Math.pow(10, len) - 1)).toFixed(0);
        value = Array(len - s.length + 1).join('0') + s;
      } else {
        value = getObjectProperty(customVars, variable);
      }
    }
  }
  return value;
};
