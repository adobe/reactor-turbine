var pseudoEvent = {
  type: 'pagetop',
  target: document.location
};

module.exports = function(trigger) {
  trigger(pseudoEvent, document.location);
};
