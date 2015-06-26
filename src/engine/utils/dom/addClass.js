var hasClass = require('./hasClass');

module.exports = function(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls;
  }
};
