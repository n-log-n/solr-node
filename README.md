# solr-node
Simple Solr Node Client Project

## Usage

```js
// Require module
var SolrNode = require('solr-node');

// Create client
var client = SolrNode();

// Create query
var query = client.query().q('text:test');

// Search documents
solrClient.search(query, function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.response);
});
```

## License
The MIT License
