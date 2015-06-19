module.exports = function(str) {
  if (!str) {
    return str;
  }
  return str
    .replace(/\&/g, '&amp;')
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
