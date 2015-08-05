'use strict';

window.assertZoomchangeCall = function(options) {
  expect(options.call.object).toBe(document);
  expect(options.call.args[0].type).toBe('zoomchange');
  expect(options.call.args[0].target).toBe(document);
  expect(options.call.args[0].method).toBe(options.method);
  expect(options.call.args[0].zoom).toBe(options.zoom);
  expect(options.call.args[1]).toBe(document);
};
