module.exports = function (turbineEmbedCode, isDynamicEnforced, logger) {
  var turbineUrl;

  try {
    // TODO: web only? I think embedded TVs wouldn't have
    //  __satellite.container.dynamicEnforced turned on
    turbineUrl = new URL(turbineEmbedCode);
  } catch (e) {
    if (isDynamicEnforced === true) {
      // TODO: this should not stay as "deprecation", but it allows us to
      //  force messages to the console
      logger.deprecation(
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    }
  }

  var shouldAugment = Boolean(isDynamicEnforced && turbineUrl);

  /**
   * Returns the host of the Turbine embed code, or an empty string if Dynamic Host
   * is not enabled.
   * @returns {string}
   */
  var getTurbineHost = function () {
    if (shouldAugment) {
      // be sure we always force https to Adobe managed domains
      return 'https://' + turbineUrl.host;
    }

    return '';
  };

  /**
   * Returns a url decorated with the host of the Turbine embed code. If Dynamic host
   * is disabled, the original sourceUrl is returned unmodified.
   * @param sourceUrl
   * @returns {string|*}
   */
  var decorateWithDynamicHost = function (sourceUrl) {
    if (shouldAugment) {
      return getTurbineHost() + '/' + sourceUrl;
    }

    return sourceUrl;
  };

  return {
    getTurbineHost: getTurbineHost,
    decorateWithDynamicHost: decorateWithDynamicHost
  };
};
