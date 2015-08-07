'use strict';

var rewire = require('rewire');

function assertTriggerCall(options) {
  expect(options.call.args[0].type).toBe('zoomchange');
  expect(options.call.args[0].target).toBe(document);
  expect(options.call.args[0].method).toBe(options.method);
  expect(options.call.args[0].zoom).toBe(options.zoom);
  expect(options.call.args[1]).toBe(document);
}

describe('zoomchange event type', function() {
  var zoomchangeDelegate;
  var mockWindow;

  beforeEach(function() {
    jasmine.clock().install();
    jasmine.clock().mockDate();

    zoomchangeDelegate = rewire('../zoomchange.js');

    mockWindow = {
      ongestureend: null,
      ontouchend: null
    };

    zoomchangeDelegate.__set__({
      window: mockWindow
    });
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('triggers rule when zoom changes', function() {
    var trigger = jasmine.createSpy();

    mockWindow.innerWidth = document.documentElement.clientWidth;

    zoomchangeDelegate({}, trigger);

    Simulate.event(document, 'gestureend');

    mockWindow.innerWidth = document.documentElement.clientWidth / 1.5;

    expect(trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(1049);

    expect(trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(1);

    expect(trigger.calls.count()).toEqual(1);
    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      method: 'pinch',
      zoom: '1.50'
    });

    Simulate.event(document, 'touchend');
    mockWindow.innerWidth = document.documentElement.clientWidth / 2;

    jasmine.clock().tick(1249);

    expect(trigger.calls.count()).toEqual(1);

    jasmine.clock().tick(1);

    expect(trigger.calls.count()).toEqual(2);
    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      method: 'double tap',
      zoom: '2.00'
    });
  });
});
