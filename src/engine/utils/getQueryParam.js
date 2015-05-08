var isString = require('./isString');
var forEach = require('./forEach');
var escapeForHTML = require('./escapeForHTML');

function parseQueryParams(str){
  var URIDecode = function (str) {
    var result = str
    try {
      result = decodeURIComponent(str)
    } catch(err) {}

    return result
  }

  if (str === '' || isString(str) === false) return {}
  if (str.indexOf('?') === 0) {
    str = str.substring(1)
  }
  var ret = {}
    , pairs = str.split('&')
  forEach(pairs, function(pair){
    pair = pair.split('=')
    if (!pair[1]) {
      return
    }
    ret[URIDecode(pair[0])] = escapeForHTML(URIDecode(pair[1]))
  })
  return ret
}

var caseSensitivityQueryParamsMap;
function getCaseSensitivityQueryParamsMap(str) {
  if (!caseSensitivityQueryParamsMap) {
    var mixCase = parseQueryParams(str)
    var lowerCase = {}

    for (var prop in mixCase)
      if (mixCase.hasOwnProperty(prop))
        lowerCase[prop.toLowerCase()] = mixCase[prop]

    caseSensitivityQueryParamsMap = {
      mixCase: mixCase,
      lowerCase: lowerCase
    };
  }

  return caseSensitivityQueryParamsMap;
}


// TODO: We're caching query string parameters which could change when using pushState. Remove caching? Re-cache when URL changes?
module.exports = function(key, ignoreCase) {
  var paramsMap = getCaseSensitivityQueryParamsMap(window.location.search);
  if (ignoreCase) {
    return paramsMap.lowerCase[key.toLowerCase()];
  } else {
    return paramsMap.mixCase[key];
  }
};
