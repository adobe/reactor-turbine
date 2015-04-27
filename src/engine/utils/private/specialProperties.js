var getElementText = require('./getElementText');
var cleanText = require('./cleanText');

// Special Properties for DOM elements. You use special properties using
// the @ prefix. Example:
//
//     this.@text
module.exports = {
  text: getElementText,
  cleanText: function(obj){
    return cleanText(getElementText(obj))
  }
}
