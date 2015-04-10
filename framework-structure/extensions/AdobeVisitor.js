var AdobeVisitor = function(propertySettings, extensionSettings) {};

AdobeVisitor.prototype.loadVisitorId = function(actionSettings) {
  setTimeout(function() {
    this.trigger('visitorIdLoaded', 'ABC123');
  }.bind(this), 2000);
};

_satellite.utils.EventEmitter.mixin(AdobeVisitor);

module.exports = AdobeVisitor;
