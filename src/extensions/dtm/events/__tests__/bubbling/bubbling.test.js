/*eslint max-len:0*/
'use strict';

describe('bubbling', function() {
  // Test each scenario with eventHandlerOnElement toggled. The behavior should be consistent.
  [true, false].forEach(function(eventHandlerOnElement) {
    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           not processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config A', 'bubbling.html', {
      bubbleFireIfParent: false,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: false,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config B', 'bubbling.html', {
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: true,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
    //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           not processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config C', 'bubbling.html', {
      bubbleFireIfParent: false,
      bubbleFireIfChildFired: false,
      bubbleStop: false,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: false,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           not processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config D', 'bubbling.html', {
      bubbleFireIfParent: false,
      bubbleFireIfChildFired: true,
      bubbleStop: true,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: false,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           not processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config E', 'bubbling.html', {
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: false,
      bubbleStop: false,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: false,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           not processed
    //      Rule B will be                                           processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config F', 'bubbling.html', {
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: true,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: false,
      bExecuted: true,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
    //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
    //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           not processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config G', 'bubbling.html', {
      bubbleFireIfParent: false,
      bubbleFireIfChildFired: false,
      bubbleStop: true,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: false,
      cExecuted: true
    });

    //    Given element A contains element B and element B contains element C
    //    Given rule A targets element A with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    Given rule B targets element B with:
    //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
    //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
    //    Given rule C targets element C with:
    //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
    //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
    //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
    //    The user clicks on element C then
    //      Rule A will be                                           processed
    //      Rule B will be                                           not processed
    //      Rule C will be                                           processed
    runTestPage('handles bubbling with config H', 'bubbling.html', {
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: false,
      bubbleStop: true,
      eventHandlerOnElement: eventHandlerOnElement,
      aExecuted: true,
      bExecuted: false,
      cExecuted: true
    });
  });
});
