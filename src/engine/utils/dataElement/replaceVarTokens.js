var getVar = require('./getVar');

// Perform variable subtitutions substitute to a string where subtitions are
// specified in the form `"%foo%"`. Variables are lookup either in `SL.data.customVars`, or
// if the `elm` parameter is passed it, and the variable spec is of the form `"%this.tagName%"`, it
// is subsituted with the properties on `elm`, *i.e. `elm.tagName`.
//
// Parameters:
//
// - `str` - string to apply substitutions to
// - `elm`(optional) - object or element to use for substitutions of the form `%this.property%`
// - `target`(optional) - element to use for subsitution of the form `%target.property%`
module.exports = function(str, elm, evt) {
  if (typeof str !== 'string') return str
  return str
    .replace(/%(.*?)%/g, function(m, variable){
      var val = getVar(variable, elm, evt)
      if (val == null)
        return m
      else
        return val
    })
};
