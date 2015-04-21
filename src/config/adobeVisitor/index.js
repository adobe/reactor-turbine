var AdobeVisitor = function(extensionSettings) {};

AdobeVisitor.prototype.loadVisitorId = function(actionSettings) {
  setTimeout(function() {
    this.trigger('visitorIdLoaded', 'ABC123');
  }.bind(this), 2000);
};

dtmUtils.EventEmitter.mixin(AdobeVisitor);

return function(extensionSettings) {
  return new AdobeVisitor(extensionSettings);
};
