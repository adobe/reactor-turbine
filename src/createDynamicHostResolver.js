module.exports = function (turbineEmbedCode, isDynamicEnforced) {
  var turbineUrl = new URL(turbineEmbedCode);

  return function toTurbineHost(sourceUrl) {
    if (!isDynamicEnforced) {
      return sourceUrl;
    }

    return turbineUrl.origin + sourceUrl;
  };
};
