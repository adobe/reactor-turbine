'use strict';

window.assertTimePlayedConditionCall = function(options) {
  var unitPrefix = options.unit === 'second' ? 's' : '%';
  expect(options.call.object).toBe(options.relatedElement);
  expect(options.call.args[0].type).toBe('videoplayed(' + options.amount + unitPrefix + ')');
  expect(options.call.args[0].target).toBe(options.target);
  expect(options.call.args[1]).toBe(options.target);
};
