var isObject = require('./isObject');
var isArray = require('./isArray');
var isString = require('./isString');
var contains = require('./contains');
var map = require('./map');

function stringify(obj, seenValues) {
  if (JSON && JSON.stringify) {
    return JSON.stringify(obj);
  }
  seenValues = seenValues || [];
  if (isObject(obj)) {
    if (contains(seenValues, obj)) {
      return '<Cycle>';
    } else {
      seenValues.push(obj);
    }
  }

  if (isArray(obj)) {
    return '[' + map(obj, function(value) {
          return stringify(value, seenValues);
        }).join(',') + ']';
  } else if (isString(obj)) {
    return '"' + String(obj) + '"';
  }
  if (isObject(obj)) {
    var data = [];
    for (var prop in obj) {
      data.push('"' + prop + '":' + stringify(obj[prop], seenValues));
    }
    return '{' + data.join(',') + '}';
  } else {
    return String(obj);
  }
};

module.exports = stringify;
