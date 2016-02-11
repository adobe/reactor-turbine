var document = require('document');

module.exports = function() {
  return document.location.protocol === 'https:';
};
