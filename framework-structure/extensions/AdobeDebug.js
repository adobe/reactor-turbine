var AdobeAlertExtension = function(propertySettings, extensionSettings) {};

AdobeAlertExtension.prototype.alert = function(actionSettings) {
  alert(actionSettings.text);
};

AdobeAlertExtension.prototype.log = function(actionSettings) {
  console.log('AdobeLog: '+actionSettings.text);
};

module.exports = AdobeAlertExtension;
