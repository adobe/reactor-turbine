var methods = {};
var escapeForHtml = require('./escapeForHTML');

methods.parseQueryParams = function(str){
  var URIDecode = function (str) {
    var result = str
    try {
      result = decodeURIComponent(str)
    } catch(err) {}

    return result
  }

  if (str === '' || _satellite.isString(str) === false) return {}
  if (str.indexOf('?') === 0) {
    str = str.substring(1)
  }
  var ret = {}
      , pairs = str.split('&')
  _satellite.each(pairs, function(pair){
    pair = pair.split('=')
    if (!pair[1]) {
      return
    }
    ret[URIDecode(pair[0])] = _satellite.escapeForHtml(URIDecode(pair[1]))
  })
  return ret
}

methods.getCaseSensitivityQueryParamsMap = function (str) {
  var normal = methods.parseQueryParams(str)
  var insensitive = {}

  for (var prop in normal)
    if (normal.hasOwnProperty(prop))
      insensitive[prop.toLowerCase()] = normal[prop]

  return {
    normal: normal,
    caseInsensitive: insensitive
  }
}

methods.QueryParams = methods.getCaseSensitivityQueryParamsMap(window.location.search)

methods.getQueryParam = function(key){
  return methods.QueryParams.normal[key]
}

methods.getQueryParamCaseInsensitive = function(key){
  return methods.QueryParams.caseInsensitive[key.toLowerCase()]
}

module.exports = methods;
