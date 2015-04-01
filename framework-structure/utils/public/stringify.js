module.exports = function(obj, seenValues) {
  if (JSON && JSON.stringify) {
    return JSON.stringify(obj);
  }
  seenValues = seenValues || [];
  if (SL.isObject(obj)) {
    if (SL.contains(seenValues, obj)) {
      return '<Cycle>';
    } else {
      seenValues.push(obj);
    }
  }

  if (SL.isArray(obj)) {
    return '[' + SL.map(obj, function(value) {
          return SL.stringify(value, seenValues);
        }).join(',') + ']';
  } else if (SL.isString(obj)) {
    return '"' + String(obj) + '"';
  }
  if (SL.isObject(obj)) {
    var data = [];
    for (var prop in obj) {
      data.push('"' + prop + '":' + SL.stringify(obj[prop], seenValues));
    }
    return '{' + data.join(',') + '}';
  } else {
    return String(obj);
  }
};
