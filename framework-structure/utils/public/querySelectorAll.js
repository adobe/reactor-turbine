module.exports = function (selector,callback){
  // TODO: add logic to polyfill this functionality if its not on the dom
  callback(document.querySelectorAll(selector));
};
