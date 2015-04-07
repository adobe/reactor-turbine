// `readStoredSetting(name)`
// ==================
//
// Reads the cookie of the given name.
// Stolen from <http://www.quirksmode.org/js/cookies.html>
var readStoredSetting = function(name) {
  if (!window.localStorage) return null
  name = 'sdsat_' + name
  try {
    return window.localStorage.getItem(name)
  } catch (e) {
    SL.notify('Cannot read stored setting from localStorage: ' + e.message, 2)
    return null
  }
};

// Read satelliteUtilsCookie values to see about getting bookmarklet running / settings
module.exports = function() {
  var debug = readStoredSetting('debug'),
    hideActivity = readStoredSetting('hide_activity')
  if (debug)
    SL.settings.notifications = debug === 'true'
    // if (hideActivity)
    //   SL.settings.hideActivity = hideActivity === 'true'
}
