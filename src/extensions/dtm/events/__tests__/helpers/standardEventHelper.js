var testElement;
var nestedElement;

function assertTriggerCall(options) {
  expect(options.call.args[0].type).toBe(options.type);
  expect(options.call.args[0].target).toBe(options.target);
  expect(options.call.args[1]).toBe(options.relatedElement);
}

function setup() {
  jasmine.clock().install();

  testElement = document.createElement('div');
  testElement.id = 'test';

  nestedElement = document.createElement('div');
  nestedElement.id = 'nested';
  testElement.appendChild(nestedElement);

  document.body.insertBefore(testElement, document.body.firstChild);
}

function teardown() {
  jasmine.clock().uninstall();
  document.body.removeChild(testElement);
}

module.exports = function(delegate, type) {
  return {
    testListenerAddedToElement: function() {
      it('triggers rule when listener added to to element', function() {
        setup();

        var currentTarget;
        var trigger = jasmine.createSpy().and.callFake(function(event) {
          // Current target must be captured here instead of inspecting the spy call because
          // currentTarget will change over time.
          currentTarget = event.currentTarget;
        });

        delegate({
          eventConfig: {
            selector: '#test',
            bubbleFireIfParent: true,
            eventHandlerOnElement: true
          }
        }, trigger);

        // When adding the event handler directly to the element, the global poller has to first
        // detect that the element has been added to the DOM before the event listener is added.
        jasmine.clock().tick(5000);

        // We're overloading our usage of Simulate here. The second arg is a character which only
        // applies for simulating keyboard events but doesn't really do anything in the case of
        // mouse events.
        Simulate[type](nestedElement, 'A');

        expect(trigger.calls.count()).toBe(1);

        assertTriggerCall({
          call: trigger.calls.mostRecent(),
          type: type,
          target: nestedElement,
          relatedElement: testElement
        });

        expect(currentTarget).toBe(testElement);

        teardown();
      });
    },
    testListenerAddedToDocument: function() {
      it('triggers rule when listener added to document', function() {
        setup();

        var currentTarget;
        var trigger = jasmine.createSpy().and.callFake(function(event) {
          // Current target must be captured here instead of inspecting the spy call because
          // currentTarget will change over time.
          currentTarget = event.currentTarget;
        });

        delegate({
          eventConfig: {
            selector: '#test',
            bubbleFireIfParent: true,
            eventHandlerOnElement: false
          }
        }, trigger);

        // We're overloading our usage of Simulate here. The second arg is a character which only
        // applies for simulating keyboard events but doesn't really do anything in the case of
        // mouse events.
        Simulate[type](nestedElement, 'A');

        expect(trigger.calls.count()).toBe(1);

        assertTriggerCall({
          call: trigger.calls.mostRecent(),
          type: type,
          target: nestedElement,
          relatedElement: testElement
        });

        expect(currentTarget).toBe(document);

        teardown();
      });
    }
  };
};
