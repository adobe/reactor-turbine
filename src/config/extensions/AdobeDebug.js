var AdobeDebug = function(extensionSettings, propertySettings) {};

AdobeDebug.prototype.alert = function(actionSettings) {
  alert(actionSettings.text);
};

AdobeDebug.prototype.log = function(actionSettings) {
  console.log('AdobeLog: '+actionSettings.text);
};

return AdobeDebug;
