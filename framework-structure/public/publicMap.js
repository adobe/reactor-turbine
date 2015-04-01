module.exports = {
  escapeForHTML: require('../utils/escapeForHTML.js'),
  pageBottom: require('./end-of-page.js'),
  util:{
    isString: require('../utils/isString.js'),
    matchesCSS: require('../utils/matchesCss.js'),
    queryParams: require('../utils/queryParams.js'),
    each: require('../utils/each.js')  
  }
};
