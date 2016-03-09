# solr-node
Simple Solr Node Client Project

## Install

```
npm install solr-node
```

## Usage

```js
// Require module
var SolrNode = require('solr-node');

// Create client
var client = SolrNode();

// Create query
var strQuery = client.query().q('text:test');
var objQuery = client.query().q({text:'test', title:'test'});

// Search documents using strQuery
solrClient.search(strQuery, function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.response);
});

// Search documents using objQuery
solrClient.search(objQuery, function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.response);
});

```

## Test & Coverage

```
gulp 
```
