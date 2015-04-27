var customVars = require('../../stores/customVars');

module.exports = function(){
  if (typeof arguments[0] === 'string'){
    var prop = arguments[0]
    customVars[prop] = arguments[1]
  }else if (arguments[0]){ // assume an object literal
    var mapping = arguments[0]
    for (var key in mapping)
      customVars[key] = mapping[key]
  }
}
