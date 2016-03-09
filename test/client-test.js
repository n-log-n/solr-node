/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var expect = require('chai').expect,
  nock = require('nock'),
  Client = require('../lib/client');

describe('Client', function() {
  var testClient = new Client({core: 'test'});
  before(function() {
    nock.disableNetConnect();
    nock.enableNetConnect(/127.0.0.1/);
    nock.cleanAll();
    nock('http://127.0.0.1:8983')
      .persist()
      .filteringPath(/\/solr\/error\/select.*/g, '/error/select/mock')
      .get('/error/select/mock')
      .reply(404);

    nock('http://127.0.0.1:8983')
      .persist()
      .filteringPath(/\/solr\/test\/select.*/g, '/test/select/mock')
      .get('/test/select/mock')
      .reply(200, JSON.stringify({
        responseHeader: {
          status: 0,
          QTime: 86,
          params: { q: 'text:test', wt: 'json' }
        },
        response:{
          numFound: 10,
          start: 0,
          docs: []
        }
      }));

    nock('http://127.0.0.1:8983')
      .persist()
      .filteringPath(/\/solr\/test\/terms.*/g, '/test/terms/mock')
      .get('/test/terms/mock')
      .reply(200, JSON.stringify({
        responseHeader: {
          status: 0,
          QTime: 86
        },
        terms:{
          text: []
        }
      }));
  });

  after(function() {
    nock.cleanAll();
  });

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
    it('should get error when invalid arguments.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.requestGet(client.SEARCH_PATH, function(err, result) {
        //then
        expect(err).to.equal('Invalid arguments');
        expect(result).to.not.exist;
        done();
      });
    });

    it('should get search error from server.', function(done) {
      //given
      var client = new Client({core: 'error'});
      //when
      client.requestGet(client.SEARCH_PATH, "q=*:*", function(err, result) {
        //then
        expect(err).to.equal('Solr server error: 404');
        expect(result).to.not.exist;
        done();
      });
    });

    it('should get notes data from server when query is query instance.', function(done) {
      //given
      var client = new Client({core: 'test'});
      var query = client.query().q('text:test');
      //when
      client.requestGet(client.SEARCH_PATH, query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should get notes data from server when query is query instance but query is not string.', function(done) {
      //given
      var client = new Client({core: 'test'});
      var query = client.query().q(null);
      //when
      client.requestGet(client.SEARCH_PATH, query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should get notes data from server when query is string.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.requestGet(client.SEARCH_PATH, "q=*:*", function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should get notes data from server when query is null.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.requestGet(client.SEARCH_PATH, null, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });
  });

  describe('#search', function() {
    it('should search data when not using query.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.search('q=text:test', function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should search data when query is string.', function(done) {
      //given
      var client = new Client({core: 'test'});
      var query = client.query().q('text:test');
      //when
      client.search(query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should search data when query is object.', function(done) {
      //given
      var client = new Client({core: 'test'});
      var query =
        client.query()
          .q({text:'test', title:'test'});
      //when
      client.search(query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });
  });

  describe('#terms', function() {
    it('should get terms data.', function(done) {
      //given
      var client = new Client({core: 'test'});
      var query =
        client.query()
          .termsQuery({
            fl: 'text',
            prefix: 'te'
          });
      //when
      client.terms(query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.terms).to.exist;
        done();
      });
    });
  });

});
