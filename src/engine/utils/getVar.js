var getObjectProperty = require('./getObjectProperty');
var customVars = require('../stores/customVars');
var dataElementDefinitions = require('../stores/dataElementDefinitions');
var getDataElement = require('./getDataElement');
var getURI = require('./getURI');
var getQueryParam = require('./getQueryParam');

// getVar(variable, elm, evt)
// ==========================
//
// Return the value of a variable, where the variable
// can be a data element, defined in the "data" section
// of the initial settings, or reference properties on
// an element, event, or target of the event in question,
// a query parameter, or a random number.
//
// - `variable` - the name of the variable to get
// - `[elm]` - the associated element, if any
// - `[evt]` - the associated event, if any
module.exports = function(variable, elm, evt){
  var target = evt ? (evt.target || evt.srcElement) : null
    , URI = getURI()
    , randMatch
    , value
  var map = {
    URI: URI,
    uri: URI,
    protocol: document.location.protocol,
    hostname: document.location.hostname
  }
  if (dataElementDefinitions.getByName(variable)){
    return getDataElement(variable)
  }
  value = map[variable]
  if (value === undefined){
    if (variable.substring(0, 5) === 'this.'){
      variable = variable.slice(5)
      value = getObjectProperty(elm, variable, true)
    }else if(variable.substring(0, 6) === 'event.'){
      variable = variable.slice(6)
      value = getObjectProperty(evt, variable)
    }else if(variable.substring(0, 7) === 'target.'){
      variable = variable.slice(7)
      value = getObjectProperty(target, variable)
    }else if(variable.substring(0, 7) === 'window.'){
      variable = variable.slice(7)
      value = getObjectProperty(window, variable)
    }else if (variable.substring(0, 6) === 'param.'){
      variable = variable.slice(6)
      value = getQueryParam(variable)
    }else if(randMatch = variable.match(/^rand([0-9]+)$/)){
      var len = Number(randMatch[1])
        , s = (Math.random() * (Math.pow(10, len) - 1)).toFixed(0)
      value = Array(len - s.length + 1).join('0') + s
    }else{
      value = getObjectProperty(customVars, variable)
    }
  }
  return value
}
