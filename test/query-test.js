/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var expect = require('chai').expect,
  Query = require('../lib/query');

describe('Query', function() {
  describe('#dismax', function() {
    it('should get dismax params.', function() {
      //given
      var testQuery = new Query();
      //when
      var query = testQuery.dismax();
      //then
      expect(query.params).to.eql([ 'defType=dismax' ]);
    });
  });

  describe('#edismax', function() {
    it('should get edismax params.', function() {
      //given
      var testQuery = new Query();
      //when
      var query = testQuery.edismax();
      //then
      expect(query.params).to.eql([ 'defType=edismax' ]);
    });
  });

  describe('#q', function() {
    it('should get query params when params is string.', function() {
      //given
      var testQuery = new Query();
      var params = 'text:test';
      //when
      var query = testQuery.q(params);
      //then
      expect(query.params).to.eql([ 'q=text:test' ]);
    });

    it('should get query params when params is object.', function() {
      //given
      var testQuery = new Query();
      var params = {
        text: 'test',
        title: 'test'
      };
      //when
      var query = testQuery.q(params);
      //then
      expect(query.params).to.eql([ 'q=text:test AND title:test' ]);
    });
  });

  describe('#fl', function() {
    it('should get fl params when params is string.', function() {
      //given
      var testQuery = new Query();
      var params = 'text';
      //when
      var query = testQuery.fl(params);
      //then
      expect(query.params).to.eql([ 'fl=text' ]);
    });

    it('should get fl params when params is array.', function() {
      //given
      var testQuery = new Query();
      var params = ['text','title'];
      //when
      var query = testQuery.fl(params);
      //then
      expect(query.params).to.eql([ 'fl=text,title' ]);
    });
  });

  describe('#start', function() {
    it('should get start params when params is number.', function() {
      //given
      var testQuery = new Query();
      var params = 10;
      //when
      var query = testQuery.start(params);
      //then
      expect(query.params).to.eql([ 'start=10' ]);
    });
  });

  describe('#rows', function() {
    it('should get rows params when params is number.', function() {
      //given
      var testQuery = new Query();
      var params = 10;
      //when
      var query = testQuery.rows(params);
      //then
      expect(query.params).to.eql([ 'rows=10' ]);
    });
  });

  describe('#sort', function() {
    it('should get sort params when params is object.', function() {
      //given
      var testQuery = new Query();
      var params = {score:'desc', like:'desc'};
      //when
      var query = testQuery.sort(params);
      //then
      expect(query.params).to.eql([ 'sort=score desc,like desc' ]);
    });
  });

  describe('#fq', function() {
    it('should get fq params when params is object.', function() {
      //given
      var testQuery = new Query();
      var params = {like:10, hate:10};
      //when
      var query = testQuery.fq(params);
      //then
      expect(query.params).to.eql([ 'fq=like:10 AND hate:10' ]);
    });
  });

  describe('#termsQuery', function() {
    it('should get terms params when params not string and object.', function() {
      //given
      var testQuery = new Query();
      var params = null;
      //when
      var query = testQuery.termsQuery(params);
      //then
      expect(query.params).to.eql([]);
    });

    it('should get terms params when params is string.', function() {
      //given
      var testQuery = new Query();
      var params = "terms=true&terms.fl=text";
      //when
      var query = testQuery.termsQuery(params);
      //then
      expect(query.params).to.eql([
        "terms=true&terms.fl=text"
      ]);
    });

    it('should get terms params when params is object.', function() {
      //given
      var testQuery = new Query();
      var params = {
        fl: 'text',
        prefix: 'te'
      };
      //when
      var query = testQuery.termsQuery(params);
      //then
      expect(query.params).to.eql([
        "terms=true",
        "terms.fl=text",
        "terms.prefix=te"
      ]);
    });

    it('should get terms params when params is object(on:false).', function() {
      //given
      var testQuery = new Query();
      var params = {
        on: false
      };
      //when
      var query = testQuery.termsQuery(params);
      //then
      expect(query.params).to.eql([
        "terms=false"
      ]);
    });

    it('should get terms params when params is object of other params.', function() {
      //given
      var testQuery = new Query();
      var params = {
        fl: 'text',
        lower: 'te',
        lowerIncl: true,
        mincount: 1,
        maxcount: 100
      };
      //when
      var query = testQuery.termsQuery(params);
      //then
      expect(query.params).to.eql([
        'terms=true',
        'terms.fl=text',
        'terms.lower=te',
        'terms.lower.incl=true',
        'terms.mincount=1',
        'terms.maxcount=100'
      ]);
    });

    it('should get terms params when params is object of other params2.', function() {
      //given
      var testQuery = new Query();
      var params = {
        fl: 'text',
        regex: '[test]',
        regexFlag: 'literal',
        limit: 10,
        upper: 'te',
        upperIncl: true,
        raw: true,
        sort: 'index'
      };
      //when
      var query = testQuery.termsQuery(params);
      //then
      expect(query.params).to.eql([
        'terms=true',
        'terms.fl=text',
        'terms.regex=[test]',
        'terms.regexFlag=literal',
        'terms.limit=10',
        'terms.upper=te',
        'terms.upper.incl=true',
        'terms.raw=true',
        'terms.sort=index'
      ]);
    });
  });
});
