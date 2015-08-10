'use strict';

describe('entersViewport event type', function() {
  var delegate;
  var aElement;
  var bElement;

  function createElements() {
    aElement = document.createElement('div');
    aElement.id = 'a';
    aElement.innerHTML = 'a';
    document.body.insertBefore(aElement, document.body.firstChild);

    bElement = document.createElement('div');
    bElement.id = 'b';
    bElement.innerHTML = 'b';
    aElement.appendChild(bElement);
  }

  function removeElements() {
    if (aElement) {
      document.body.removeChild(aElement);
    }
    aElement = bElement = null;
  }

  function assertTriggerCall(options) {
    expect(options.call.args[0].type).toBe('inview');
    expect(options.call.args[0].target).toBe(options.target);
    expect(options.call.args[0].inviewDelay).toBe(options.delay);
    expect(options.call.args[1]).toBe(options.relatedElement);
  }

  beforeAll(function() {
    jasmine.clock().install();
    var publicRequire = require('../../../../../engine/publicRequire');
    var delegateInjector = require('inject!../entersViewport');
    delegate = delegateInjector({
      poll: publicRequire('poll'),
      createDataStash: publicRequire('createDataStash'),
      createBubbly: publicRequire('createBubbly')
    });
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  beforeEach(function() {
    createElements();
  });

  afterEach(function() {
    removeElements();
    window.scrollTo(0, 0);
  });

  describe('targeting single element', function() {
    it('triggers multiple rules with no delay', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#a',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, a2Trigger);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        relatedElement: aElement,
        target: aElement
      });

      assertTriggerCall({
        call: a2Trigger.calls.mostRecent(),
        relatedElement: aElement,
        target: aElement
      });
    });

    it('triggers multiple rules with same delay', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a',
          delay: 100000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#a',
          delay: 100000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, a2Trigger);

      // Give time for the poller to cycle.
      jasmine.clock().tick(50000);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        relatedElement: aElement,
        target: aElement,
        delay: 100000
      });

      assertTriggerCall({
        call: a2Trigger.calls.mostRecent(),
        relatedElement: aElement,
        target: aElement,
        delay: 100000
      });
    });

    it('triggers multiple rules with different delays', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a',
          delay: 100000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#a',
          delay: 200000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, a2Trigger);

      // Give time for the poller to cycle.
      jasmine.clock().tick(50000);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(0);

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        relatedElement: aElement,
        target: aElement,
        delay: 100000
      });

      assertTriggerCall({
        call: a2Trigger.calls.mostRecent(),
        relatedElement: aElement,
        target: aElement,
        delay: 200000
      });
    });
  });

  describe('targeting nested elements', function() {
    it('triggers multiple rules with no delay', function() {
      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#b',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, bTrigger);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);

      expect(aTrigger.calls.count()).toBe(2);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        relatedElement: aElement,
        target: aElement
      });

      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        relatedElement: aElement,
        target: bElement
      });

      expect(bTrigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: bTrigger.calls.mostRecent(),
        relatedElement: bElement,
        target: bElement
      });
    });

    it('triggers multiple rules with different delays', function() {
      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a',
          delay: 100000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#b',
          delay: 200000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, bTrigger);

      expect(aTrigger.calls.count()).toBe(0);
      expect(bTrigger.calls.count()).toBe(0);

      jasmine.clock().tick(150000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);

      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        delay: 100000,
        relatedElement: aElement,
        target: aElement
      });

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: bTrigger.calls.mostRecent(),
        delay: 200000,
        relatedElement: bElement,
        target: bElement
      });
    });

    it('triggers multiple rules with the same delay', function() {
      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a',
          delay: 100000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#b',
          delay: 100000,
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        }
      }, bTrigger);

      jasmine.clock().tick(150000);

      expect(aTrigger.calls.count()).toEqual(2);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        delay: 100000,
        relatedElement: aElement,
        target: aElement
      });
      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        delay: 100000,
        relatedElement: aElement,
        target: bElement
      });

      expect(bTrigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: bTrigger.calls.mostRecent(),
        delay: 100000,
        relatedElement: bElement,
        target: bElement
      });
    });
  });

  describe('scrolling', function() {
    it('triggers rule with no delay', function() {
      aElement.style.position = 'absolute';
      aElement.style.top = '3000px';

      var aTrigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a'
        }
      }, aTrigger);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);

      // The rule shouldn't be triggered because the element isn't in view.
      expect(aTrigger.calls.count()).toEqual(0);

      window.scrollTo(0, 3000);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);

      expect(aTrigger.calls.count()).toEqual(1);
    });

    it('triggers rules with various delays targeting elements at various positions', function() {
      aElement.style.position = 'absolute';
      aElement.style.top = '10000px';

      bElement.style.position = 'absolute';
      bElement.style.top = '10000px';

      aElement.classList.add('mine');
      bElement.classList.add('mine');

      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();
      var b2Trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#a'
        }
      }, aTrigger);

      delegate({
        eventConfig: {
          selector: '#b',
          delay: 50000
        }
      }, bTrigger);

      delegate({
        eventConfig: {
          selector: '#b',
          delay: 200000
        }
      }, b2Trigger);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);
      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);
      expect(b2Trigger.calls.count()).toEqual(0);

      window.scrollTo(0, 10000);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);
      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);
      expect(b2Trigger.calls.count()).toEqual(0);

      window.scrollTo(0, 0);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);

      window.scrollTo(0, 10000);

      // Give time for the poller to cycle.
      jasmine.clock().tick(10000);

      // The first trigger should only be called the first time the element comes into view.
      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);
      expect(b2Trigger.calls.count()).toEqual(0);

      window.scrollTo(0, 20000);

      // Give time for the poller to cycle but not enough time for the configured delay
      // time to pass. The second trigger shouldn't be called because the configured delay time
      // hasn't passed.
      jasmine.clock().tick(5000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);
      expect(b2Trigger.calls.count()).toEqual(0);

      window.scrollTo(0, 0);

      // Give time for the poller to cycle and enough time for the configured delay time to
      // pass. The second trigger shouldn't be called because the b element is no longer in view.
      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);
      expect(b2Trigger.calls.count()).toEqual(0);

      window.scrollTo(0, 20000);

      // Give time for the poller to cycle and enough time for the configured delay time to
      // pass. The second trigger should be called.
      jasmine.clock().tick(100000);
      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(1);
      expect(b2Trigger.calls.count()).toEqual(0);

      // A different rule watching for the same element but an even longer delay time? Oh my!
      jasmine.clock().tick(200000);
      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(1);
      expect(b2Trigger.calls.count()).toEqual(1);
    });
  });

});
