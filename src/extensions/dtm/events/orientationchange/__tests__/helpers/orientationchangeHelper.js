'use strict';

window.assertOrientationchangeCall = function(options) {
  expect(options.call.object).toBe(window);
  expect(options.call.args[0].type).toBe('orientationchange');
  expect(options.call.args[0].target).toBe(window);
  expect(options.call.args[0].orientation).toBe(options.orientation);
  expect(options.call.args[1]).toBe(window);
};
