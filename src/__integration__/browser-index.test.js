describe('Integration: dist/engine.js', () => {
  beforeAll((done) => {
    // Simulate a container being present before index.js is imported
    window._satellite = {
      container: {
        buildInfo: {},
        company: {
          dynamicCdnEnabled: false,
          cdnAllowList: []
        },
        property: {
          settings: {
            undefinedVarsReturnEmpty: false,
            ruleComponentSequencingEnabled: true
          }
        },
        environment: {
          stage: 'development'
        },
        dataElements: {},
        rules: []
      }
    };

    const script = document.createElement('script');
    script.src = '/base/dist/engine.js'; // '/base/' is Karma's base URL prefix
    script.onload = () => done();
    script.onerror = (e) => done.fail(`Failed to load engine.js: ${e.message}`);
    document.body.appendChild(script);
  });

  fit('should have expected _satellite functions', async () => {
    expect(window._satellite)
      .withContext('Expected window._satellite to be defined.')
      .toBeDefined();
    expect(window._satellite.track)
      .withContext('Expected window._satellite.track to be defined.')
      .toBeDefined();
    expect(window._satellite.setVar)
      .withContext('Expected window._satellite.setVar to be defined.')
      .toBeDefined();
    expect(window._satellite.getVar)
      .withContext('Expected window._satellite.getVar to be defined.')
      .toBeDefined();
    expect(window._satellite.setDebug)
      .withContext('Expected window._satellite.setDebug to be defined.')
      .toBeDefined();
  });
});
