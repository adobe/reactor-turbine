'use strict';

describe('elementExists event type', function() {
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
    expect(options.call.args[0].type).toBe('elementexists');
    expect(options.call.args[0].target).toBe(options.target);
    expect(options.call.args[1]).toBe(options.relatedElement);
  }

  beforeAll(function() {
    jasmine.clock().install();
    var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
    var delegateInjector = require('inject!../elementExists');
    delegate = delegateInjector({
      poll: publicRequire('poll'),
      createDataStash: publicRequire('createDataStash'),
      'dtm/createBubbly': publicRequire('dtm/createBubbly')
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
  });

  it('triggers multiple rules targeting the same element', function() {
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
    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement
    });

    expect(a2Trigger.calls.count()).toEqual(1);
    assertTriggerCall({
      call: a2Trigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement
    });
  });

  it('triggers rules appropriately for nested elements', function() {
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

    expect(aTrigger.calls.count()).toEqual(2);

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

    expect(bTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: bTrigger.calls.mostRecent(),
      relatedElement: bElement,
      target: bElement
    });
  });
});
