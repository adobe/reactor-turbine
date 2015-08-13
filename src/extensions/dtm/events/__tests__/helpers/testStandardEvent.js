'use strict';

var outerElement;
var innerElement;

function assertTriggerCall(options) {
  expect(options.call.args[0].type).toBe(options.type);
  expect(options.call.args[0].target).toBe(options.target);
  expect(options.call.args[1]).toBe(options.relatedElement);
}

module.exports = function(delegate, type) {
  beforeAll(function() {
    outerElement = document.createElement('div');
    outerElement.id = 'outer';

    innerElement = document.createElement('div');
    innerElement.id = 'inner';
    outerElement.appendChild(innerElement);

    document.body.insertBefore(outerElement, document.body.firstChild);
  });

  afterAll(function() {
    document.body.removeChild(outerElement);
  });

  it('triggers rule when event occurs', function() {
    var trigger = jasmine.createSpy();

    delegate({
      eventConfig: {
        selector: '#outer',
        bubbleFireIfParent: true
      }
    }, trigger);

    // We're overloading our usage of Simulate here. The second arg is a character which only
    // applies for simulating keyboard events but doesn't really do anything in the case of
    // mouse events.
    Simulate[type](innerElement, 'A');

    expect(trigger.calls.count()).toBe(1);

    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      type: type,
      target: innerElement,
      relatedElement: outerElement
    });
  });
};
