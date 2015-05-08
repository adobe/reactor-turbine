var setCookie = require('../utils/setCookie');
var readCookie = require('../utils/readCookie');

var pageviewCache = {};

module.exports = function(key, length){
  // TODO: This is the only place in the engine I've seen this pattern where the function
  // is both a getter and a setter. Change or keep?
  if (arguments.length > 2){
    // setter
    var value = arguments[2]
    if (length === 'pageview'){
      pageviewCache[key] = value
    }else if (length === 'session'){
      setCookie('_sdsat_' + key, value)
    }else if (length === 'visitor') {
      setCookie('_sdsat_' + key, value, 365 * 2)
    }
  }else{
    // getter
    if (length === 'pageview'){
      return pageviewCache[key]
    }else if (length === 'session' || length === 'visitor'){
      return readCookie('_sdsat_' + key)
    }
  }
}
