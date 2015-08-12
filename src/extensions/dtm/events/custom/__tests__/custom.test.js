'use strict';

var testElement;
var nestedElement;

function assertTriggerCall(options) {
  expect(options.call.args[0].type).toBe(options.type);
  expect(options.call.args[0].target).toBe(options.target);
  expect(options.call.args[1]).toBe(options.relatedElement);
}

function triggerCustomEvent(element, type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  element.dispatchEvent(event);
  return event;
}

describe('custom event type', function() {
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../custom');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  beforeAll(function() {
    testElement = document.createElement('div');
    testElement.id = 'test';

    nestedElement = document.createElement('div');
    nestedElement.id = 'nested';
    testElement.appendChild(nestedElement);

    document.body.insertBefore(testElement, document.body.firstChild);
  });

  afterAll(function() {
    document.body.removeChild(testElement);
  });

  it('triggers rule when event occurs', function() {
    var CUSTOM_EVENT_TYPE = 'foo';

    var trigger = jasmine.createSpy();

    delegate({
      eventConfig: {
        selector: '#test',
        type: CUSTOM_EVENT_TYPE,
        bubbleFireIfParent: true
      }
    }, trigger);

    var event = triggerCustomEvent(nestedElement, CUSTOM_EVENT_TYPE);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe(event);
    expect(call.args[1]).toBe(testElement);
  });
});
