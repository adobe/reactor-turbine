'use strict';

describe('change event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../change');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly'),
    textMatch: publicRequire('textMatch')
  });

  function assertTriggerCall(options) {
    expect(options.call.args[0].type).toBe('change');
    expect(options.call.args[0].target).toBe(options.target);
    expect(options.call.args[1]).toBe(options.relatedElement);
  }

  describe('without value defined', function() {
    testStandardEvent(delegate, 'change');
  });

  describe('with value defined', function() {
    var testElement;
    var nestedElement;

    beforeAll(function() {
      testElement = document.createElement('div');
      testElement.id = 'test';

      nestedElement = document.createElement('input');
      nestedElement.setAttribute('type', 'text');
      nestedElement.id = 'nested';
      testElement.appendChild(nestedElement);

      document.body.insertBefore(testElement, document.body.firstChild);
    });

    afterAll(function() {
      document.body.removeChild(testElement);
    });

    it('triggers rule when a string value matches', function() {
      var trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#test',
          value: 'foo',
          bubbleFireIfParent: true
        }
      }, trigger);

      nestedElement.value = 'foo';
      Simulate.change(nestedElement);

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        target: nestedElement,
        relatedElement: testElement
      });
    });

    it('does not trigger rule when a string value does not match', function() {
      var trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#test',
          value: 'foo',
          bubbleFireIfParent: true
        }
      }, trigger);

      nestedElement.value = 'bar';
      Simulate.change(nestedElement);

      expect(trigger.calls.count()).toBe(0);
    });

    it('triggers rule when a regex value matches', function() {
      var trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#test',
          value: /^f/,
          bubbleFireIfParent: true
        }
      }, trigger);

      nestedElement.value = 'foo';
      Simulate.change(nestedElement);

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        target: nestedElement,
        relatedElement: testElement
      });
    });

    it('does not trigger rule when a string value does not match', function() {
      var trigger = jasmine.createSpy();

      delegate({
        eventConfig: {
          selector: '#test',
          value: /^f/,
          bubbleFireIfParent: true
        }
      }, trigger);

      nestedElement.value = 'bar';
      Simulate.change(nestedElement);

      expect(trigger.calls.count()).toBe(0);
    });
  });
});
