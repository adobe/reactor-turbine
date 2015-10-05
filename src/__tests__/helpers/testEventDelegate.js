function getTestEventDelegate() {
  return function(module, require) {
    var triggers = [];

    _satellite.triggerTestEvent = function() {
      triggers.forEach(function(trigger) {
        trigger();
      });
    };

    module.exports = function(config, trigger) {
      triggers.push(trigger);
    };
  };
};
