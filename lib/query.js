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
 * @param {Object|String} params - query object or query string
 */
Query.prototype.q = function(params) {
  var self = this;
  var queryPrefix = 'q=';
  if (_.isObject(params)) {
    self.params.push(queryPrefix + qs.stringify(params, ' AND ', ':'))
  } else if (_.isString(params)) {
    self.params.push(queryPrefix + params);
  } else {
    self.params.push(queryPrefix + '*:*');
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