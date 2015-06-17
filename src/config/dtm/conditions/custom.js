module.exports = function(settings, event, relatedElement) {
  return settings.script.call(relatedElement, event, event ? event.target : undefined);
};
