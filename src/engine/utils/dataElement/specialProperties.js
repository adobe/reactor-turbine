var getElementText = require('./../dom/getElementText');
var cleanText = require('./../string/cleanText');

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
