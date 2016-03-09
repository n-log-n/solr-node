/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var _ = require('underscore'),
  request = require('request'),
  logger =  require('log4js').getLogger('Client'),
  Query = require('./query');

/**
 * Solr Node Client
 * @constructor
 *
 * @param {Object} options
 * @param {String} [options.host] - host address of Solr server
 * @param {Number|String} [options.port] - port number of Solr server
 * @param {String} [options.core] - client core name
 * @param {String} [options.rootPath] - solr root path
 * @param {String} [options.protocol] - request protocol ('http'|'https')
 */
function Client(options) {
  this.options = {
    host: options.host || '127.0.0.1',
    port: options.port || '8983',
    core: options.core || '',
    rootPath: options.rootPath || 'solr',
    protocol: options.protocol || 'http'
  };

  // Default Path List
  this.SEARCH_PATH = 'select';
  this.UPDATE_PATH = 'update';
  this.TERMS_PATH = 'terms';
  this.SPELL_PATH = 'spell';
}

Client.prototype._makeHostUrl = function(protocol, host, port) {
  if (port) {
    return protocol + '://' + host + ':' + port;
  } else {
    return protocol + '://' + host;
  }
};

Client.prototype.requestGet = function(path, query, finalCallback) {
  var params, options, requestPrefixUrl, requestFullPath;

  if (arguments.length < 3) {
    return finalCallback("Invalid arguments");
  }

  if (query instanceof Query) {
    params = query.toString();
  } else if (_.isString(query)) {
    params = query;
  }

  requestPrefixUrl = this._makeHostUrl(this.options.protocol, this.options.host, this.options.port);
  requestPrefixUrl += '/' + [this.options.rootPath, this.options.core, path].join('/');

  requestFullPath = requestPrefixUrl + '?' + encodeURI(params) + '&wt=json';

  options = {
    method: 'GET',
    url: requestFullPath,
    headers: {
      'accept' : 'application/json; charset=utf-8'
    }
  };
  request(options, function (err, res, body) {
    if (err) {
      return finalCallback(err);
    }
    if (res.statusCode !== 200) {
      logger.error(body);
      return finalCallback('Solr server error: ' + res.statusCode);
    }
    finalCallback(err, body);
  });
};

Client.prototype.search = function(query, finalCallback) {
  this.requestGet(this.SEARCH_PATH, query, finalCallback);
};


module.exports = Client;