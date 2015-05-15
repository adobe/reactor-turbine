var trim = require('./trim');

// `cleanText(str)`
// ================
//
// "Cleans" the text from an element's innerText. This is used directly by the
// @cleanText special property.
module.exports = function(str){
  if (str == null) return null
  return trim(str).replace(/\s{2,}/g, ' ')
    .replace(/[^\000-\177]*/g, '')
}
