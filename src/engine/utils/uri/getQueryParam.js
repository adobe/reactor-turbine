var isString = require('./../isType/isString');
var escapeForHTML = require('./../string/escapeForHTML');

function parseQueryParams(str) {
  var decode = function(value) {
    var result = value;
    try {
      result = decodeURIComponent(value);
    } catch (err) {
      // ignore
    }

    return result;
  };

  if (str === '' || isString(str) === false) {
    return {};
  }
  if (str.indexOf('?') === 0) {
    str = str.substring(1);
  }
  var ret = {};
  var pairs = str.split('&');
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    if (!pair[1]) {
      return;
    }
    ret[decode(pair[0])] = escapeForHTML(decode(pair[1]));
  });
  return ret;
}

var caseSensitivityQueryParamsMap;
function getCaseSensitivityQueryParamsMap(str) {
  if (!caseSensitivityQueryParamsMap) {
    var mixCase = parseQueryParams(str);
    var lowerCase = {};

    for (var prop in mixCase)
      if (mixCase.hasOwnProperty(prop)) {
        lowerCase[prop.toLowerCase()] = mixCase[prop];
      }

    caseSensitivityQueryParamsMap = {
      mixCase: mixCase,
      lowerCase: lowerCase
    };
  }

  return caseSensitivityQueryParamsMap;
}


// TODO: We're caching query string parameters which could change when using pushState.
// Remove caching? Re-cache when URL changes?
module.exports = function(key, ignoreCase) {
  var paramsMap = getCaseSensitivityQueryParamsMap(window.location.search);
  if (ignoreCase) {
    return paramsMap.lowerCase[key.toLowerCase()];
  } else {
    return paramsMap.mixCase[key];
  }
};
