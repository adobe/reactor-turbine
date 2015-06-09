describe('Page Tests', function() {
  runTestPage('pageTop.test.html');
  runTestPage('pageBottom.test.html');
  runTestPage('domReady.test.html');
  runTestPage('onload.test.html');
  runTestPage('mouse/preAddElementWithHandlerOnDocument.html');
  runTestPage('mouse/preAddElementWithHandlerOnElement.html');
  runTestPage('mouse/postAddElementWithHandlerOnDocument.html');
  runTestPage('mouse/postAddElementWithHandlerOnElement.html');
  runTestPage('entersViewport/preAddElementInView.html');
  runTestPage('entersViewport/preAddElementScrollingComplex.html');
  runTestPage('entersViewport/postAddElementInView.html');
  runTestPage('entersViewport/postAddElementScrolling.html');
});
