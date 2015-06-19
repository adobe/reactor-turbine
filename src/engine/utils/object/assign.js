module.exports = function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var from = arguments[i];
    if (from === null || from === undefined) {
      continue;
    }
    for (var key in from) {
      if (from.hasOwnProperty(key)) {
        target[key] = from[key];
      }
    }
  }
  return target;
};
