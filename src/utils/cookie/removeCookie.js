var setCookie = require('./setCookie');

module.exports = function(name) {
  setCookie(name, '', -1);
};
