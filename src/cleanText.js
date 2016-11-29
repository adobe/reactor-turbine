/**
 * "Cleans" text by trimming the string and removing spaces and newlines.
 * @param {string} str The string to clean.
 * @returns {string}
 */
module.exports = function(str) {
  return typeof str === 'string' ? str.replace(/\s+/g, ' ').trim() : str;
};
