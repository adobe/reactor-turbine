(function() {
  function respond(event, data) {
    event.source.postMessage(data, event.origin);
  }

  function receiveMessage(event) {
    if (event.origin === 'http://dtm.aaronhardy.com') {
      switch(event.data.type) {
        case 'validate':
          if (window.dtm.validate) {
            respond(event, {
              type: 'validateResponse',
              content: window.dtm.validate()
            });
          }
          break;
        case 'getSettings':
          if (window.dtm.getSettings) {
            respond(event, {
              type: 'getSettingsResponse',
              content: window.dtm.getSettings()
            });
          }
          break;
      }
    }
  }

  window.addEventListener('message', receiveMessage);

  window.dtm = {
    validate: null,
    getArguments: null
  };
})();
