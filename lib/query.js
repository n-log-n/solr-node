/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var _ = require('underscore'),
  logger =  require('log4js').getLogger('Query'),
  qs = require('querystring');

/**
 * Solr Query
 * @constructor
 */
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
  logger.debug('[q] params: ', self.params);

  return self;
};

/**
 * Set terms params
 *
 * @param {Object|String} params - terms object or terms string
 * @param {Boolean} [params.on=true] - Turn on or off terms
 * @param {String} params.fl - The name of the field to get the terms from.
 * @param {String} [params.lower] - The term to start at. If not specified, the empty string is used, meaning start at the beginning of the field.
 * @param {Boolean} [params.lowerIncl] - The term to start at. Include the lower bound term in the result set. Default is true.
 * @param {Number} [params.mincount] - The minimum doc frequency to return in order to be included.
 * @param {Number} [params.maxcount] - The maximum doc frequency.
 * @param {String} [params.prefix] - Restrict matches to terms that start with the prefix.
 * @param {String} [params.regex] - Restrict matches to terms that match the regular expression.
 * @param {String} [params.regexFlag] - Flags to be used when evaluating the regular expression defined in the "terms.regex" parameter.(case_insensitive|comments|multiline|literal|dotall|unicode_case|canon_eq|unix_lines)
 * @param {Number} [params.limit] - The maximum number of terms to return.
 * @param {String} [params.upper] - The term to stop at. Either upper or terms.limit must be set.
 * @param {Boolean} [params.upperIncl] - Include the upper bound term in the result set. Default is false.
 * @param {Boolean} [params.raw] - If true, return the raw characters of the indexed term, regardless of if it is human readable.
 * @param {String} [params.sort] - If count, sorts the terms by the term frequency (highest count first). If index, returns the terms in index order.(count|index)
 */
Query.prototype.termsQ = function(params) {
  var self = this;

  if (!_.isString(params) && !_.isObject(params)) {
    return self;
  }

  if (_.isString(params)) {
    self.params.push(params);
    return self;
  }

  if (params.on === false) {
    self.params.push('terms=false');
  } else {
    self.params.push('terms=true');
  }

  if (!_.isUndefined(params.fl)) {
    self.params.push('terms.fl=' + params.fl);
  }
  if (!_.isUndefined(params.lower)) {
    self.params.push('terms.lower=' + params.lower);
  }
  if (!_.isUndefined(params.lowerIncl)) {
    self.params.push('terms.lower.incl=' + params.lowerIncl);
  }
  if (!_.isUndefined(params.mincount)) {
    self.params.push('terms.mincount=' + params.mincount);
  }
  if (!_.isUndefined(params.maxcount)) {
    self.params.push('terms.maxcount=' + params.maxcount);
  }
  if (!_.isUndefined(params.prefix)) {
    self.params.push('terms.prefix=' + params.prefix);
  }
  if (!_.isUndefined(params.regex)) {
    self.params.push('terms.regex=' + params.regex);
  }
  if (!_.isUndefined(params.regexFlag)) {
    self.params.push('terms.regexFlag=' + params.regexFlag);
  }
  if (!_.isUndefined(params.limit)) {
    self.params.push('terms.limit=' + params.limit);
  }
  if (!_.isUndefined(params.upper)) {
    self.params.push('terms.upper=' + params.upper);
  }
  if (!_.isUndefined(params.upperIncl)) {
    self.params.push('terms.upper.incl=' + params.upperIncl);
  }
  if (!_.isUndefined(params.raw)) {
    self.params.push('terms.raw=' + params.raw);
  }
  if (!_.isUndefined(params.sort)) {
    self.params.push('terms.sort=' + params.sort);
  }
  logger.debug('[terms] params: ', self.params);

  return self;
};

/**
 * Make query to string
 *
 * @returns {String}
 */
Query.prototype.toString = function() {
  logger.debug('[toString] params: ', this.params);
  return this.params.join('&');
};

module.exports = Query;