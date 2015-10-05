var cleanText = require('./../string/cleanText');

// Special Properties for DOM elements. You use special properties using
// the @ prefix. Example:
//
//     this.@text
module.exports = {
  text: function(obj) {
    return obj.textContent;
  },
  cleanText: function(obj) {
    return cleanText(obj.textContent);
  }
};
