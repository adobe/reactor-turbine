/**
 * Produces a duplicate-free version of the array.
 * @param {Array} arr The array that need to be filtered.
 */
module.exports = function(arr) {
  return arr.filter(function(element, index, array) {
    return array.indexOf(element) >= index;
  });
};
