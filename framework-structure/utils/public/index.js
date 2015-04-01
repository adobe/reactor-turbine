var req = require.context('./', false, /\.js$/);

// req.keys() requires Object.keys. We'll polyfill momentarily.
// TODO: Is this too dumb?
var previousObjectKeys = Object.keys;
Object.keys = require('./keys');
var reqKeys = req.keys();
Object.keys = previousObjectKeys;

var exports = {};

for (var i = 0; i < reqKeys.length; i++) {
  var reqKey = reqKeys[i];
  var utilName = reqKey.substring(2, reqKey.lastIndexOf('.'));
  exports[utilName] = req(reqKey);
}
console.log(exports);

module.exports = exports;
