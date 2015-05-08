// `addEventHandler(elm, evt, callback)`
// -------------------------------------
//
// Register an event handler for a element
//
// Parameters:
//
// - `elm` - the element in question
// - `evt` - the event type to listen to
// - `callback` - callback function
module.exports = window.addEventListener ?
    function(node, evt, cb){ node.addEventListener(evt, cb, false); } :
    function(node, evt, cb){ node.attachEvent('on' + evt, cb); };
