window.testMouseEvents = function(options) {
  var EVENT_TYPES = ['click', 'mouseover'];

  var currentTarget;
  var actionSpy = jasmine.createSpy();

  var conditionSpy = jasmine.createSpy().and.callFake(function(eventDetail) {
    // Current target must be captured here instead of inspecting the spy call because
    // currentTarget will change over time.
    currentTarget = eventDetail.currentTarget;
    return true;
  });

  jasmine.clock().install();

  var ruleEvents = [
    {
      type: 'dtm.click',
      settings: {
        selector: '#testContainer',
        eventHandlerOnElement: options.eventHandlerOnElement
      }
    },
    {
      type: 'dtm.mouseover',
      settings: {
        selector: '#testContainer',
        eventHandlerOnElement: options.eventHandlerOnElement
      }
    }
  ];

  configureEngineForEventTests(ruleEvents, actionSpy, conditionSpy);

  TestPage
    .waitForContentLoaded()
    .execute(function() {
      var testContainer = document.getElementById('testContainer');

      if (!testContainer) {
        testContainer = document.createElement('div');
        testContainer.id = 'testContainer';
        document.body.appendChild(testContainer);
      }

      function testEventType(eventType) {
        Simulate[eventType](testContainer);
        // Actions are always run asynchronously.
        jasmine.clock().tick(1);
        expect(actionSpy.calls.count()).toEqual(1);
        expect(conditionSpy.calls.count()).toEqual(1);
        expect(conditionSpy.calls.argsFor(0)[0].type).toEqual(eventType);
        expect(currentTarget).toBe(options.eventHandlerOnElement ? testContainer : document);
        actionSpy.calls.reset();
        conditionSpy.calls.reset();
      }

      // When adding the event handler directly to the element, the global poller has to first
      // detect that the element has been added to the DOM before the event listener is added.
      if (options.eventHandlerOnElement) {
        jasmine.clock().tick(10000);
      }

      EVENT_TYPES.forEach(testEventType);
    })
    .start();
};
