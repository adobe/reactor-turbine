module.exports = function (turbineEmbedCode, isDynamicEnforced) {
  var turbineUrl;

  try {
    turbineUrl = new URL(turbineEmbedCode);
  } catch (e) {
    // do nothing
  }

  return function toTurbineHost(sourceUrl) {
    if (!isDynamicEnforced || !turbineUrl) {
      return sourceUrl;
    }

    return turbineUrl.origin + sourceUrl;
  };
};
