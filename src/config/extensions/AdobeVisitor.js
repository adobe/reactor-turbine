var AdobeVisitor = function(extensionSettings, propertySettings) {};

AdobeVisitor.prototype.loadVisitorId = function(actionSettings) {
  setTimeout(function() {
    this.trigger('visitorIdLoaded', 'ABC123');
  }.bind(this), 2000);
};

dtmUtils.EventEmitter.mixin(AdobeVisitor);

return AdobeVisitor;
