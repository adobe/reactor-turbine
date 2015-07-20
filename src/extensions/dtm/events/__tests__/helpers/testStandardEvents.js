'use strict';

window.testStandardEvents = function(options) {
  var currentTarget;
  var actionSpy = jasmine.createSpy();

  var conditionSpy = jasmine.createSpy().and.callFake(function(event) {
    // Current target must be captured here instead of inspecting the spy call because
    // currentTarget will change over time.
    currentTarget = event.currentTarget;
    return true;
  });

  jasmine.clock().install();

  var ruleEvents = [
    {
      type: options.dtmEventType,
      config: {
        selector: '#test',
        bubbleFireIfParent: true,
        eventHandlerOnElement: options.eventHandlerOnElement
      }
    }
  ];

  window.configureActionForEventTests(actionSpy);
  window.configureRuleForEventTests(ruleEvents, conditionSpy);

  TestPage
    .waitForContentLoaded()
    .execute(function() {
      var testElement = document.getElementById('test');
      var nestedElement = document.getElementById('nested');

      if (!testElement) {
        testElement = document.createElement('div');
        testElement.id = 'test';

        nestedElement = document.createElement('div');
        nestedElement.id = 'nested';
        testElement.appendChild(nestedElement);

        document.body.appendChild(testElement);
      }

      // When adding the event handler directly to the element, the global poller has to first
      // detect that the element has been added to the DOM before the event listener is added.
      if (options.eventHandlerOnElement) {
        jasmine.clock().tick(10000);
      }

      // We're overloading our usage of Simulate here. The second arg is a character which only
      // applies for simulating keyboard events but doesn't really do anything in the case of
      // mouse events.
      Simulate[options.nativeEventType](nestedElement, 'A');
      expect(actionSpy.calls.count()).toEqual(1);
      expect(conditionSpy.calls.count()).toEqual(1);
      expect(conditionSpy.calls.first().object).toBe(testElement);
      expect(conditionSpy.calls.first().args[0].type).toEqual(options.nativeEventType);
      expect(conditionSpy.calls.first().args[1]).toBe(nestedElement);
      expect(currentTarget).toBe(options.eventHandlerOnElement ? testElement : document);
      actionSpy.calls.reset();
      conditionSpy.calls.reset();
    })
    .start();
};
