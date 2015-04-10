var AdobeDebug = function(propertySettings, extensionSettings) {};

AdobeDebug.prototype.alert = function(actionSettings) {
  alert(actionSettings.text);
};

AdobeDebug.prototype.log = function(actionSettings) {
  console.log('AdobeLog: '+actionSettings.text);
};

module.exports = AdobeDebug;
