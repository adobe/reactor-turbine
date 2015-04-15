module.exports = function(regexs){
  return function(userAgent){
    for (var key in regexs){
      var regex = regexs[key];
      var match = regex.test(userAgent);
      if (match) return key;
    }
    return "Unknown";
  };
};
