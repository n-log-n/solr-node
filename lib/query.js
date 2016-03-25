/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var _ = require('underscore'),
  logger =  require('log4js').getLogger('Query'),
  queryString = require('querystring');

/**
 * Solr Query
 * @constructor
 */
function Query() {
  this.params = [];
}

/**
 * Set DisMax query parser
 *
 * @return {Query}
 */
Query.prototype.dismax = function(){
  var self = this;
  self.params.unshift('defType=dismax');
  return self;
};

/*!
 * EDisMax parameters
 * do not forget to use `.edismax()` when using these parameters
 */

/**
 * Set eDisMax query parser
 *
 * @return {Query}
 */
Query.prototype.edismax = function(){
  var self = this;
  self.params.unshift('defType=edismax');
  return self;
};

/**
 * Set query params
 *
 * @param {Object|String} params - query object or query string
 *
 * @returns {Query}
 */
Query.prototype.q = function(params) {
  var self = this;
  var queryPrefix = 'q=';
  if (_.isObject(params)) {
    self.params.push(queryPrefix + queryString.stringify(params, ' AND ', ':'));
  } else if (_.isString(params)) {
    self.params.push(queryPrefix + params);
  } else {
    self.params.push(queryPrefix + '*:*');
  }
  logger.debug('[q] params: ', self.params);

  return self;
};

/**
 * Set field params
 *
 * @param {String|String[]} params - field name
 *
 * @returns {Query}
 */
Query.prototype.fl = function(params) {
  var self = this;
  var flPrefix = 'fl=';
  if (_.isString(params)) {
    self.params.push(flPrefix + params);
  } else if (_.isArray(params)) {
    self.params.push(flPrefix + params.join(','));
  }
  return self;
};

/**
 * Set start params
 *
 * @param {Number} params - offset number
 *
 * @returns {Query}
 */
Query.prototype.start = function(params) {
  var self = this;
  self.params.push('start=' + params);
  return self;
};

/**
 * Set rows params
 *
 * @param {Number} params - size number
 *
 * @returns {Query}
 */
Query.prototype.rows = function(params) {
  var self = this;
  self.params.push('rows=' + params);
  return self;
};

/**
 * Set sort params
 *
 * @param {Object} params - sort options
 *
 * @return {Query}
 */
Query.prototype.sort = function(params){
  var self = this;
  var sortPrefix = 'sort=';
  self.params.push(sortPrefix + queryString.stringify(params, ',', ' '));
  return self;
};

/**
 * Set filter query params
 *
 * @param {Object|Object[]} params - filter options
 * @param {String} params.field - filter field
 * @param {String|Number} params.value - filter value
 *
 * @return {Query}
 */
Query.prototype.fq = function(params) {
  var self = this;
  var fqPrefix = 'fq=';
  var i, len;

  if (_.isArray(params)) {
    for (i = 0, len = params.length; i < len; i++) {
      self.params.push(fqPrefix + params[i].field + ":" + params[i].value);
    }
  } else if (_.isObject(params)) {
    self.params.push(fqPrefix + params.field + ":" + params.value);
  }
  return self;
};

/**
 * Set the default query field.
 *
 * @param {String} params -  default field for search
 *
 * @return  {Query}
 */
Query.prototype.df = function (params) {
  var self = this;
  self.params.push('df=' + params);
  return self;
};

/**
 * Set terms query params
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
 *
 * @returns {Query}
 */
Query.prototype.termsQuery = function(params) {
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
  logger.debug('[termsQuery] params: ', self.params);

  return self;
};

/**
 * Set mlt query params
 *
 * @param {Object|String} params - mlt object or mlt string
 * @param {Boolean} [params.on=true] - Turn on or off mlt
 * @param {String|Array} [params.fl] - Specifies the fields to use for similarity. If possible, these should have stored termVectors.
 * @param {Number} [params.mintf] - Specifies the Minimum Term Frequency, the frequency below which terms will be ignored in the source document.
 * @param {Number} [params.mindf] - Specifies the Minimum Document Frequency, the frequency at which words will be ignored which do not occur in at least this many documents.
 * @param {Number} [params.maxdf] - Specifies the Maximum Document Frequency, the frequency at which words will be ignored which occur in more than this many documents.
 * @param {Number} [params.minwl] - Sets the minimum word length below which words will be ignored.
 * @param {Number} [params.maxwl] - Sets the maximum word length above which words will be ignored.
 * @param {Number} [params.maxqt] - Sets the maximum number of query terms that will be included in any generated query.
 * @param {Number} [params.maxntp] - Sets the maximum number of tokens to parse in each example document field that is not stored with TermVector support.
 * @param {Boolean} [params.boost] - Specifies if the query will be boosted by the interesting term relevance. It can be either "true" or "false".
 * @param {String} [params.qf] - Query fields and their boosts using the same format as that used by the DisMaxRequestHandler. These fields must also be specified in mlt.fl.
 * @param {Number} [params.count] - Specifies the number of similar documents to be returned for each result. The default value is 5.
 * @param {Boolean} [params.matchInclude] - Specifies whether or not the response should include the matched document. If set to false, the response will look like a normal select response.
 * @param {Number} [params.matchOffset] - Specifies an offset into the main query search results to locate the document on which the MoreLikeThis query should operate. By default, the query operates on the first result for the q parameter.
 * @param {String} [params.interestingTerms] - Controls how the MoreLikeThis component presents the "interesting" terms (the top TF/IDF terms) for the query. ("list"|"details"|"none")
 *
 * @returns {Query}
 */
Query.prototype.mltQuery = function(params) {
  var self = this;

  if (!_.isString(params) && !_.isObject(params)) {
    return self;
  }

  if (_.isString(params)) {
    self.params.push(params);
    return self;
  }

  if (params.on === false) {
    self.params.push('mlt=false');
  } else {
    self.params.push('mlt=true');
  }

  if (!_.isUndefined(params.fl)) {
    if (_.isArray(params.fl)) {
      params.fl = params.fl.join(',');
    }
    self.params.push('mlt.fl=' + params.fl);
  }
  if (!_.isUndefined(params.mintf)) {
    self.params.push('mlt.mintf=' + params.mintf);
  }
  if (!_.isUndefined(params.mindf)) {
    self.params.push('mlt.mindf=' + params.mindf);
  }
  if (!_.isUndefined(params.maxdf)) {
    self.params.push('mlt.maxdf=' + params.maxdf);
  }
  if (!_.isUndefined(params.minwl)) {
    self.params.push('mlt.minwl=' + params.minwl);
  }
  if (!_.isUndefined(params.maxwl)) {
    self.params.push('mlt.maxwl=' + params.maxwl);
  }
  if (!_.isUndefined(params.maxqt)) {
    self.params.push('mlt.maxqt=' + params.maxqt);
  }
  if (!_.isUndefined(params.maxntp)) {
    self.params.push('mlt.maxntp=' + params.maxntp);
  }
  if (!_.isUndefined(params.boost)) {
    self.params.push('mlt.boost=' + params.boost);
  }
  if (!_.isUndefined(params.qf)) {
    self.params.push('mlt.qf=' + params.qf);
  }
  if (!_.isUndefined(params.count)) {
    self.params.push('mlt.count=' + params.count);
  }
  if (!_.isUndefined(params.matchInclude)) {
    self.params.push('mlt.match.include=' + params.matchInclude);
  }
  if (!_.isUndefined(params.matchOffset)) {
    self.params.push('mlt.match.offset=' + params.matchOffset);
  }
  if (!_.isUndefined(params.interestingTerms)) {
    self.params.push('mlt.interestingTerms=' + params.interestingTerms);
  }
  logger.debug('[mltQuery] params: ', self.params);

  return self;
};

/**
 * Set spellcheck query params
 *
 * @param {Object|String} params - spell object or spell string
 * @param {Boolean} [params.on=true] - Turn on or off spell
 * @param {String} [params.q] - Selects the query to be spellchecked.
 * @param {Boolean} [params.build] - Instructs Solr to build a dictionary for use in spellchecking.
 * @param {Boolean} [params.collate] - Causes Solr to build a new query based on the best suggestion for each term in the submitted query.
 * @param {Number} [params.maxCollations] - This parameter specifies the maximum number of collations to return.
 * @param {Number} [params.maxCollationTries] - This parameter specifies the number of collation possibilities for Solr to try before giving up.
 * @param {Number} [params.maxCollationEvaluations] - This parameter specifies the maximum number of word correction combinations to rank and evaluate prior to deciding which collation candidates to test against the index.
 * @param {Boolean} [params.collateExtendedResults] - If true, returns an expanded response detailing the collations found. If s pellcheck.collate is false, this parameter will be ignored.
 * @param {Number} [params.collateMaxCollectDocs] - The maximum number of documents to collect when testing potential Collations
 * @param {Number} [params.count] - Specifies the maximum number of spelling suggestions to be returned.
 * @param {String} [params.dictionary] - Specifies the dictionary that should be used for spellchecking.
 * @param {Boolean} [params.extendedResults] - Causes Solr to return additional information about spellcheck results, such as the frequency of each original term in the index (origFreq) as well as the frequency of each suggestion in the index (frequency).
 * @param {Boolean} [params.onlyMorePopular] - Limits spellcheck responses to queries that are more popular than the original query.
 * @param {Number} [params.maxResultsForSuggest] - The maximum number of hits the request can return in order to both generate spelling suggestions and set the "correctlySpelled" element to "false".
 * @param {Number} [params.alternativeTermCount] - The count of suggestions to return for each query term existing in the index and/or dictionary.
 * @param {Boolean} [params.reload] - Reloads the spellchecker.
 * @param {Number} [params.accuracy] - Specifies an accuracy value to help decide whether a result is worthwhile. The value is a float between 0 and 1.
 *
 * @returns {Query}
 */
Query.prototype.spellcheckQuery = function(params) {
  var self = this;

  if (!_.isString(params) && !_.isObject(params)) {
    return self;
  }

  if (_.isString(params)) {
    self.params.push(params);
    return self;
  }

  if (params.on === false) {
    self.params.push('spellcheck=false');
  } else {
    self.params.push('spellcheck=true');
  }

  if (!_.isUndefined(params.q)) {
    self.params.push('spellcheck.q=' + params.q);
  }
  if (!_.isUndefined(params.build)) {
    self.params.push('spellcheck.build=' + params.build);
  }
  if (!_.isUndefined(params.collate)) {
    self.params.push('spellcheck.collate=' + params.collate);
  }
  if (!_.isUndefined(params.maxCollations)) {
    self.params.push('spellcheck.maxCollations=' + params.maxCollations);
  }
  if (!_.isUndefined(params.maxCollationTries)) {
    self.params.push('spellcheck.maxCollationTries=' + params.maxCollationTries);
  }
  if (!_.isUndefined(params.maxCollationEvaluations)) {
    self.params.push('spellcheck.maxCollationEvaluations=' + params.maxCollationEvaluations);
  }
  if (!_.isUndefined(params.collateExtendedResults)) {
    self.params.push('spellcheck.collateExtendedResults=' + params.collateExtendedResults);
  }
  if (!_.isUndefined(params.collateMaxCollectDocs)) {
    self.params.push('spellcheck.collateMaxCollectDocs=' + params.collateMaxCollectDocs);
  }
  if (!_.isUndefined(params.count)) {
    self.params.push('spellcheck.count=' + params.count);
  }
  if (!_.isUndefined(params.dictionary)) {
    self.params.push('spellcheck.dictionary=' + params.dictionary);
  }
  if (!_.isUndefined(params.extendedResults)) {
    self.params.push('spellcheck.extendedResults=' + params.extendedResults);
  }
  if (!_.isUndefined(params.onlyMorePopular)) {
    self.params.push('spellcheck.onlyMorePopular=' + params.onlyMorePopular);
  }
  if (!_.isUndefined(params.maxResultsForSuggest)) {
    self.params.push('spellcheck.maxResultsForSuggest=' + params.maxResultsForSuggest);
  }
  if (!_.isUndefined(params.alternativeTermCount)) {
    self.params.push('spellcheck.alternativeTermCount=' + params.alternativeTermCount);
  }
  if (!_.isUndefined(params.reload)) {
    self.params.push('spellcheck.reload=' + params.reload);
  }
  if (!_.isUndefined(params.accuracy)) {
    self.params.push('spellcheck.accuracy=' + params.accuracy);
  }
  logger.debug('[spellcheckQuery] params: ', self.params);

  return self;
};

/**
 * Set facet query params
 * @param {Object|String} params - facet object or facet string
 * @param {Boolean} [params.on=true] - Turn on or off facet
 * @param {String} [params.query] - Specifies a Lucene query to generate a facet count.
 * @param {String|Array} [params.field] - Identifies a field to be treated as a facet.
 * @param {String} [params.prefix] - Limits the terms used for faceting to those that begin with the specified prefix.
 * @param {String} [params.contains] - Limits the terms used for faceting to those that contain the specified substring.
 * @param {String} [params.containsIgnoreCase] - If facet.contains is used, ignore case when searching for the specified substring.
 * @param {String} [params.sort] - Controls how faceted results are sorted. (count|index)
 * @param {Number} [params.limit] - Controls how many constraints should be returned for each facet.
 * @param {Number} [params.offset] - Specifies an offset into the facet results at which to begin displaying facets.
 * @param {Number} [params.mincount] - Specifies the minimum counts required for a facet field to be included in the response.
 * @param {Boolean} [params.missing] - Controls whether Solr should compute a count of all matching results which have no value for the field, in addition to the term-based constraints of a facet field.
 * @param {String} [params.method] - Selects the algorithm or method Solr should use when faceting a field. (enum|fc|fcs)
 *
 * @returns {Query}
 */
Query.prototype.facetQuery = function(params) {
  var self = this;

  if (!_.isString(params) && !_.isObject(params)) {
    return self;
  }

  if (_.isString(params)) {
    self.params.push(params);
    return self;
  }

  if (params.on === false) {
    self.params.push('facet=false');
  } else {
    self.params.push('facet=true');
  }

  if (!_.isUndefined(params.query)) {
    self.params.push('facet.query=' + params.query);
  }
  if (!_.isUndefined(params.field)) {
    if (_.isArray(params.field)) {
      params.field = params.field.join(',');
    }
    self.params.push('facet.field=' + params.field);
  }
  if (!_.isUndefined(params.prefix)) {
    self.params.push('facet.prefix=' + params.prefix);
  }
  if (!_.isUndefined(params.contains)) {
    self.params.push('facet.contains=' + params.contains);
  }
  if (!_.isUndefined(params.containsIgnoreCase)) {
    self.params.push('facet.contains.ignoreCase=' + params.containsIgnoreCase);
  }
  if (!_.isUndefined(params.sort)) {
    self.params.push('facet.sort=' + params.sort);
  }
  if (!_.isUndefined(params.limit)) {
    self.params.push('facet.limit=' + params.limit);
  }
  if (!_.isUndefined(params.offset)) {
    self.params.push('facet.offset=' + params.offset);
  }
  if (!_.isUndefined(params.mincount)) {
    self.params.push('facet.mincount=' + params.mincount);
  }
  if (!_.isUndefined(params.missing)) {
    self.params.push('facet.missing=' + params.missing);
  }
  if (!_.isUndefined(params.method)) {
    self.params.push('facet.method=' + params.method);
  }
  logger.debug('[facetQuery] params: ', self.params);

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