/*eslint no-alert:0*/
'use strict';

var AdobeDebug = function() {
};

AdobeDebug.prototype.alert = function(actionSettings) {
  alert(actionSettings.text);
};

AdobeDebug.prototype.log = function(actionSettings) {
  console.log('AdobeLog: ' + actionSettings.text);
};

module.exports = function(extensionSettings) {
  return new AdobeDebug(extensionSettings);
};
