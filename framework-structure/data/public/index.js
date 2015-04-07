var clientInfoUtil = require('../../utils/public/clientInfo');

module.exports = {
  clientInfo: {
    browser: clientInfoUtil.getBrowser(navigator.userAgent),
    os: clientInfoUtil.getOS(navigator.userAgent),
    deviceType: clientInfoUtil.getDeviceType(navigator.userAgent),
    browserWidth: clientInfoUtil.getBrowserWidth(),
    browserHeight: clientInfoUtil.getBrowserHeight(),
    resolution: clientInfoUtil.getResolution(),
    screenWidth: clientInfoUtil.getScreenWidth(),
    screenHeight: clientInfoUtil.getScreenHeight(),
    colorDepth: clientInfoUtil.getColorDepth(),
    jsVersion: clientInfoUtil.getJSVersion(),
    isJavaEnabled: clientInfoUtil.getIsJavaEnabled(),
    isCookiesEnabled: clientInfoUtil.getIsCookiesEnabled(),
    connectionType: clientInfoUtil.getConnectionType(),
    isHomePage: clientInfoUtil.getIsHomePage()
  }
};
