var isNaN = require('./isNaN');
// `isNumber(thing)`
// -----------------
//
// Returns whether thing is a number
module.exports = function(thing) {
  return Object.prototype.toString.apply(thing) === '[object Number]' && !isNaN(thing);
};
