var window = require('window');
var assign = window.Object.assign;

if (typeof assign === 'undefined') {
  assign = function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var from = arguments[i];
      if (from === null || from === undefined) {
        continue;
      }
      var keys = Object.keys(from);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        target[key] = from[key];
      }
    }
    return target;
  };
}

module.exports = assign;
