/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var expect = require('chai').expect,
  Query = require('../lib/query');

describe('Query', function() {

  describe('#q', function() {
    it('should get query params when query is string.', function() {
      //given
      var testQuery = new Query();
      var params = 'text:test';
      //when
      var query = testQuery.q(params);
      //then
      expect(query.params).to.eql([ 'q=text:test' ]);
    });

    it('should get query params when query is object.', function() {
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

  describe('#terms', function() {
    it('should get terms params when terms is string.', function() {
      //given
      var testQuery = new Query();
      var params = "terms=true&terms.fl=text";
      //when
      var terms = testQuery.termsQ(params);
      //then
      expect(terms.params).to.eql([
        "terms=true&terms.fl=text"
      ]);
    });

    it('should get terms params when terms is object.', function() {
      //given
      var testQuery = new Query();
      var params = {
        fl: 'text',
        prefix: 'te'
      };
      //when
      var terms = testQuery.termsQ(params);
      //then
      expect(terms.params).to.eql([
        "terms=true",
        "terms.fl=text",
        "terms.prefix=te"
      ]);
    });

    it('should get terms params when terms is object of other params.', function() {
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
      var terms = testQuery.termsQ(params);
      //then
      expect(terms.params).to.eql([
        'terms=true',
        'terms.fl=text',
        'terms.lower=te',
        'terms.lower.incl=true',
        'terms.mincount=1',
        'terms.maxcount=100'
      ]);
    });

    it('should get terms params when terms is object of other params2.', function() {
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
      var terms = testQuery.termsQ(params);
      //then
      expect(terms.params).to.eql([
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
