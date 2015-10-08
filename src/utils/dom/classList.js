/**
 * Implementation of Element.classList for use in browsers that do not support
 * it natively.
 */
module.exports = {
  /**
   * Adds a class to an element's list of classes. If class already exists in the element's list
   * of classes, it will not add the class again.
   * @param {HTMLElement} element The element to which the class should be added.
   * @param {string} name A case-sensitive string representing the class name.
   */
  add: function(element, name) {
    if (!this.contains(element, name)) {
      element.className += ' ' + name;
    }
  },
  /**
   * Removes a class from an element's list of classes in a safe manner. Errors are not thrown if
   * the class does not exist.
   * @param {HTMLElement} element The element to which the class should be added.
   * @param {string} name A case-sensitive string representing the class name.
   */
  remove: function(element, name) {
    if (this.contains(element, name)) {
      var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
      element.className = element.className.replace(reg, ' ');
    }
  },
  /**
   * If the name exists within the element's classList, it will be removed. If name does not exist,
   * it will be added.
   * @param {HTMLElement} element The element to which the class should be added.
   * @param {string} name A case-sensitive string representing the class name.
   * @param [force=false] When true, adds the class (same with add()). When false, the class is
   * removed (same as remove()). If not used (undefined or simply non-existant), normal toggle
   * behavior ensues. Useful for adding or removing in one step baesd on a condition.
   * @returns {boolean} True if the class is now present, false otherwise.
   */
  toggle: function(element, name, force) {
    var add = force === undefined ? !this.contains(element, name) : force;
    this[add ? 'add' : 'remove'](element, name);
    return add;
  },
  /**
   * Checks if an element's list of classes contains a specific class.
   * @param {HTMLElement} element The element to which the class should be added.
   * @param {string} name A case-sensitive string representing the class name.
   * @returns {boolean} True if the class is present, false otherwise.
   */
  contains: function(element, name) {
    return element.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
  }
};
