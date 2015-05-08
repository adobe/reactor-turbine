// TODO: Add Sizzle support. Does this need to be async?
//var querySelectorPromise = require('../private/ensureQuerySelector')();
//
//module.exports = function (selector, callback){
//  querySelectorPromise.then(function() {
//    callback(document.querySelector(selector));
//  });
//};

module.exports = document.querySelector.bind(document);
