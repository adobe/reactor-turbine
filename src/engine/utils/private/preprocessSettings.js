var isString = require('../public/isString');
var isObject = require('../public/isObject');
var isArray = require('../public/isArray');
var replaceVarTokens = require('./replaceVarTokens');

function forceLowerCaseIfNeeded(value, forceLowerCase) {
  return forceLowerCase && isString(value) ? value.toLowerCase() : value
}

function preprocessObject(obj, elm, evt, forceLowerCase){
  var ret = {}
  for (var key in obj){
    if (obj.hasOwnProperty(key)){
      var value = obj[key]
      if (isObject(value)){
        ret[key] = preprocessObject(value)
      }else if (isArray(value)){
        ret[key] = preprocessArray(value)
      }else{
        ret[key] = forceLowerCaseIfNeeded(replaceVarTokens(value, elm, evt), forceLowerCase)
      }
    }
  }
  return ret
}

function preprocessArray(arr, elm, evt, forceLowerCase){
  var ret = []
  for (var i = 0, len = arr.length; i < len; i++){
    var value = arr[i]
    if (isString(value)){
      value = forceLowerCaseIfNeeded(replaceVarTokens(value, elm, evt), forceLowerCase)
      if (forceLowerCase) {

      }
    }else if (value && value.constructor === Object){ // TODO: Can we use isObject here?
      value = preprocessObject(value, elm, evt, forceLowerCase)
    }
    ret.push(value)
  }
  return ret
}

module.exports = function(settings, elm, evt, forceLowerCase){
  if (!settings) return settings
  return preprocessObject(settings, elm, evt, forceLowerCase);
  // The methods above are not placed in here because we don't want to be creating instances
  // of them every time this method is called.
}
