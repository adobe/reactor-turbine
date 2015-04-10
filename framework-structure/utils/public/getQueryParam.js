var isString = require('../public/isString');
var each = require('../public/each');
var escapeForHTML = require('../public/escapeForHTML');

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
  each(pairs, function(pair){
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
    var sensitive = parseQueryParams(str)
    var insensitive = {}

    for (var prop in sensitive)
      if (sensitive.hasOwnProperty(prop))
        insensitive[prop.toLowerCase()] = sensitive[prop]

    caseSensitivityQueryParamsMap = {
      sensitive: sensitive,
      insensitive: insensitive
    };
  }

  return caseSensitivityQueryParamsMap;
}


module.exports = function(key, caseSensitive) {
  var paramsMap = getCaseSensitivityQueryParamsMap(window.location.search);
  if (caseSensitive) {
    return paramsMap.sensitive[key];
  } else {
    return paramsMap.insensitive[key.toLowerCase()];
  }
};
