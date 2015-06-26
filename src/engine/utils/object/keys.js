module.exports = function(obj) {
  var ret = [];
  for (var key in obj) {
    ret.push(key);
  }
  return ret;
};
