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
    it('should get query params when query is object.', function() {
      //given
      var testQuery = new Query();
      var query = {
        text: 'test',
        title: 'test'
      };
      //when
      var queryObj = testQuery.q(query);
      //then
      expect(queryObj.params).to.eql([ 'q=text:test AND title:test' ]);
    });
  });
});
