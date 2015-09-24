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
      resourceProvider: publicRequire('resourceProvider')
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
      selector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      selector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
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

  it('triggers a rule if elementProperties match', function() {
    var trigger = jasmine.createSpy();

    delegate({
      selector: '#b',
      elementProperties: {
        'innerHTML': 'b'
      }
    }, trigger);

    // Give time for the poller to cycle.
    jasmine.clock().tick(10000);

    expect(trigger.calls.count()).toEqual(1);
  });

  it('does not trigger a rule if elementProperties do not match', function() {
    var trigger = jasmine.createSpy();

    delegate({
      selector: '#b',
      elementProperties: {
        'innerHTML': 'no match'
      }
    }, trigger);

    // Give time for the poller to cycle.
    jasmine.clock().tick(10000);

    expect(trigger.calls.count()).toEqual(0);
  });

  it('continues evaluating elements until elementProperties is satisfied (DTM-6681)', function() {
    var selectorOnlyTrigger = jasmine.createSpy();
    var selectorAndPropsTrigger = jasmine.createSpy();

    delegate({
      selector: 'div'
    }, selectorOnlyTrigger);

    delegate({
      selector: 'div',
      elementProperties: {
        'innerHTML': 'added later'
      }
    }, selectorAndPropsTrigger);

    // Give time for the poller to cycle.
    jasmine.clock().tick(10000);

    expect(selectorOnlyTrigger.calls.count()).toBe(1);
    expect(selectorAndPropsTrigger.calls.count()).toBe(0);

    var addedLaterElement = document.createElement('div');
    addedLaterElement.innerHTML = 'added later';
    document.body.appendChild(addedLaterElement);

    // Give time for the poller to cycle.
    jasmine.clock().tick(10000);

    expect(selectorOnlyTrigger.calls.count()).toBe(1);
    expect(selectorAndPropsTrigger.calls.count()).toBe(1);
  });
});
