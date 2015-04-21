var AdobeDebug = function(extensionSettings) {};

AdobeDebug.prototype.alert = function(actionSettings) {
  alert(actionSettings.text);
};

AdobeDebug.prototype.log = function(actionSettings) {
  console.log('AdobeLog: '+actionSettings.text);
};

return function(extensionSettings) {
  return new AdobeDebug(extensionSettings);
};
