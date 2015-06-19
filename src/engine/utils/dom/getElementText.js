module.exports = function(element) {
  return element.textContent || element.innerText;
};
