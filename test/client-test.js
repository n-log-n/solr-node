/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var expect = require('chai').expect,
  Client = require('../lib/client');

describe('Client', function() {
  var testClient = new Client({core: 'test'});

  describe('#constructor', function() {
    it('should create default client.', function() {
      //given
      var options = {};
      //when
      var client = new Client(options);
      //then
      expect(client.options).to.eql({
        host: '127.0.0.1',
        port: '8983',
        core: '',
        rootPath: 'solr',
        protocol: 'http'
      });
    });

    it('should create client when core:"test".', function() {
      //given
      var options = {
        core: 'test'
      };
      //when
      var client = new Client(options);
      //then
      expect(client.options).to.eql({
        host: '127.0.0.1',
        port: '8983',
        core: 'test',
        rootPath: 'solr',
        protocol: 'http'
      });
    });
  });

  describe('#_makeHostUrl', function() {
    it('should get host url.', function() {
      //given
      var protocol = 'http';
      var host = '127.0.0.1';
      var port = '8983';
      //when
      var hostUrl = testClient._makeHostUrl(protocol, host, port);
      //then
      expect(hostUrl).to.equal('http://127.0.0.1:8983');
    });

    it('should get host url when port is empty and protocol is https.', function() {
      //given
      var protocol = 'https';
      var host = 'test.com';
      var port = '';
      //when
      var hostUrl = testClient._makeHostUrl(protocol, host, port);
      //then
      expect(hostUrl).to.equal('https://test.com');
    });
  });

  describe('#requestGet', function() {
    it('should get search error from server.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.requestGet(client.SEARCH_PATH, "q=*:*", function(err, result) {
        //then
        expect(err).to.equal('Solr server error: 404');
        expect(result).to.not.exist;
        done();
      });
    });

    it('should get notes search data from server.', function(done) {
      //given
      var client = new Client({core: 'notes'});
      //when
      client.requestGet(client.SEARCH_PATH, "q=*:*", function(err, result) {
        //then
        console.log(result);
        done();
      });
    });
  });

});
