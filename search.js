const util = require('util')
var SolrNode = require('./lib/client');

var client = new SolrNode({
    host: 'localhost',
    port: '8983',
    core: 'whydis',
    protocol: 'http'
});

var params = {
    on : true,
    q: 'samsung ga',

}
var strQuery = client.query().suggest(params);
client.suggest(strQuery, function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   result = result.suggest.mySuggester[params.q];
   if (result.numFound > 0) {
        result.suggestions.forEach(function(value){
            console.log(value.term);
        })

   }
});
