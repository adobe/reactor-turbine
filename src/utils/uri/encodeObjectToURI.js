var isObject = require('./../isType/isObject');

module.exports = function(obj) {
  if (isObject(obj) === false) {
    return '';
  }

  var uri = [];
  Object.keys(obj).forEach(function(key) {
    uri.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  });

  return uri.join('&');
};
