/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var _ = require('underscore'),
  logger =  require('log4js').getLogger('Query'),
  qs = require('querystring');


  function Query() {
  this.params = [];
}

/**
 * Set query params
 *
 * @param {Object|String} query - query object or query string
 */
Query.prototype.q = function(query) {
  var self = this;
  var queryParam = 'q=';
  if (_.isString(query)) {
    self.params.push(queryParam + query);
  } else {
    self.params.push(queryParam + '*:*');
  }
  logger.debug('[q] query: ', self.params);

  return self;
};

/**
 * Make query string
 *
 * @returns {String}
 */
Query.prototype.toString = function() {
  logger.debug('[toString] params: ', this.params);
  return this.params.join('&');
};

module.exports = Query;