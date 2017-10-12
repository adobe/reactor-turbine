'use strict';

var cookie = require('js-cookie');

// js-cookie has other methods that we haven't exposed here. By limiting the exposed API,
// we have a little more flexibility to change the underlying implementation later. If clear
// use cases come up for needing the other methods js-cookie exposes, we can re-evaluate whether
// we want to expose them here.
module.exports = {
  get: cookie.get,
  set: cookie.set,
  remove: cookie.remove
};
