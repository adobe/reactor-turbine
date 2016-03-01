var assign = require('./../object/assign');
var EventEmitter = require('tiny-emitter');

EventEmitter.mixin = function(obj) {
  assign(typeof obj === 'function' ? obj.prototype : obj, EventEmitter.prototype);
};

// Event emitter based on `tiny-emitter` library. It supports the following methods: `on`, `off`,
// `once`, `emit` and `mixin`. The `mixin` method can be used to add event emitter functionality to
// functions or existing instances.
module.exports = EventEmitter;
