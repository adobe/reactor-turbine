// `covertData(elm, prop, [val])`
// ----------------------------
//
// Our own `covertData()` method, [a la jQuery](http://api.jquery.com/jQuery.data/)
// , used to get or set
// properties on DOM elements without going insane.
// `uuid` and `dataCache` are used by `covertData()`
//
// Parameters:
//
// - `elm` - the element to get or set a property to
// - `prop` - the property name
// - `val` - the value of the property, if omitted, the method will
//      return the existing value of the property, if any
var privateData = {
  dataCache: {},
  uuid: 1
};
module.exports = function(elm, prop, val) {
  var __satellite__ = '__satellite__';
  var cache = privateData.dataCache;
  var uuid = elm[__satellite__];
  if (!uuid) {
    uuid = elm[__satellite__] = privateData.uuid++;
  }
  var datas = cache[uuid];
  if (!datas) {
    datas = cache[uuid] = {};
  }
  if (val === undefined) {
    return datas[prop];
  } else {
    datas[prop] = val;
  }
};
