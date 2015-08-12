'use strict';

describe('locationchange event type', function() {
  var delegate;
  var origHref = window.location.href;

  function assertTriggerCall(call) {
    expect(call.args[0].type).toBe('locationchange');
    expect(call.args[0].target).toBe(document);
    expect(call.args[1]).toBe(document);
  }

  beforeAll(function() {
    var publicRequire = require('../../../../../engine/publicRequire');
    var delegateInjector = require('inject!../locationchange');
    delegate = delegateInjector({
      debounce: publicRequire('debounce'),
      once: publicRequire('once')
    });
  });

  afterEach(function() {
    // Just so the URL goes back to what it was. That way when we refresh the browser when
    // debugging it actually loads the correct url.
    window.history.replaceState(null, null, origHref);
  });

  it('triggers rule on the hash change event', function(done) {
    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    window.location.hash = 'hashchange-' + Math.floor(Math.random() * 100);

    // Typically would use a jasmine clock but part of this is waiting for the browser to
    // asynchronously trigger the event which can't be sped up.
    setTimeout(function() {
      expect(trigger.calls.count()).toBe(1);
      assertTriggerCall(trigger.calls.mostRecent());
      done();
    }, 5);
  });

  it('triggers rule when pushState is called and on the popstate event', function(done) {
    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    window.history.pushState({some: 'state'}, null, 'pushStateTest.html');

    // Typically would use a jasmine clock but part of this is waiting for the browser to
    // asynchronously trigger the event which can't be sped up.
    waitUntil(function() {
      return trigger.calls.count() > 0;
    }).then(function() {
      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall(trigger.calls.mostRecent());

      window.history.back(); // This causes the popstate event.

      waitUntil(function() {
        return trigger.calls.count() > 1;
      }).then(function() {
        expect(trigger.calls.count()).toBe(2);
        assertTriggerCall(trigger.calls.mostRecent());
        done();
      });
    });
  });

  it('triggers rule when replaceState is called', function(done) {
    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    window.history.replaceState({some: 'state'}, null, 'replaceStateTest.html');

    waitUntil(function() {
      return trigger.calls.count() > 0;
    }).then(function() {
      expect(trigger.calls.count()).toBe(1);
      assertTriggerCall(trigger.calls.mostRecent());
      done();
    });
  });
});
