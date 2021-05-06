module.exports = function (turbineEmbedCode, isDynamicEnforced, logger) {
  var turbineUrl;

  try {
    // TODO: web only? I think embedded TVs wouldn't have
    //  __satellite.container.dynamicEnforced turned on
    turbineUrl = new URL(turbineEmbedCode);
  } catch (e) {
    if (isDynamicEnforced) {
      // TODO: this should not stay as "deprecation", but it allows us to
      //  force messages to the console
      logger.deprecation(
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    }
  }

  var shouldAugment = Boolean(isDynamicEnforced && turbineUrl);

  var getTurbineHost = function () {
    if (shouldAugment) {
      return 'https://' + turbineUrl.host;
    }

    return '';
  };

  var augmentUrl = function (sourceUrl) {
    if (shouldAugment) {
      return getTurbineHost() + '/' + sourceUrl;
    }

    return sourceUrl;
  };

  return {
    getTurbineHost: getTurbineHost,
    augmentUrl: augmentUrl
  };
};
