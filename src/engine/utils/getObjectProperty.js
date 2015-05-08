var specialProperties = require('./specialProperties');

module.exports = function(obj, property, supportSpecial){
  var propChain = property.split('.')
  var currValue = obj
  var attrMatch
  for (var i = 0, len = propChain.length; i < len; i++){
    if (currValue == null) return undefined
    var prop = propChain[i]
    if (supportSpecial && prop.charAt(0) === '@'){
      var specialProp = prop.slice(1)
      currValue = specialProperties[specialProp](currValue)
      continue
    }
    if (currValue.getAttribute &&
      (attrMatch = prop.match(/^getAttribute\((.+)\)$/))){
      var attr = attrMatch[1]
      currValue = currValue.getAttribute(attr)
      continue
    }
    currValue = currValue[prop]
  }
  return currValue
};
