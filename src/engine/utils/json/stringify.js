var isObject = require('./../isType/isObject');
var isArray = require('./../isType/isArray');
var isString = require('./../isType/isString');
var includes = require('./../array/includes');
var map = require('./../array/map');

function stringify(obj, seenValues) {
  if (JSON && JSON.stringify) {
    return JSON.stringify(obj);
  }
  seenValues = seenValues || [];
  if (isObject(obj)) {
    if (includes(seenValues, obj)) {
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
}
module.exports = stringify;
