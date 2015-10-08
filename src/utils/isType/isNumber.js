/**
 * Returns whether the value is a number.
 * @param {*} thing
 * @returns {boolean}
 */
module.exports = function(thing) {
  return Object.prototype.toString.apply(thing) === '[object Number]' && !isNaN(thing);
};
