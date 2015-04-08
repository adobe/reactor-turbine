var AdobeAlertExtension = function(propertySettings, extensionSettings) {};

AdobeAlertExtension.prototype.alert = function(actionSettings) {
  alert(actionSettings.text);
};

module.exports = AdobeAlertExtension;
