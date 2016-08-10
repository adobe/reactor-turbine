/**
 * Creates a function that, when called, will return the full hosted lib file URL.
 *
 * @param {string} hostedLibFilesBaseUrl
 * @returns {Function}
 */
module.exports = function(hostedLibFilesBaseUrl) {
  return function(file) {
    return hostedLibFilesBaseUrl + file;
  };
};
