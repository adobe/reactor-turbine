// TODO: Add Sizzle support. Does this need to be async?
//var querySelectorPromise = require('../private/ensureQuerySelector')();
//
//module.exports = function (selector, callback){
//  querySelectorPromise.then(function() {
//    callback(document.querySelectorAll(selector));
//  });
//};

module.exports = document.querySelectorAll.bind(document);
