module.exports = function() {
  // This should not be cached because it can change when using the browser history API.
  return document.location.pathname + document.location.search;
};
