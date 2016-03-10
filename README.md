# solr-node
Simple Solr Node Client Project

## Install

```
npm install solr-node
```


## Usage

### Search

```js
// Require module
var SolrNode = require('solr-node');

// Create client
var client = SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'test',
    protocol: 'http'
});

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

### Update

```js
// Require module
var SolrNode = require('solr-node');

// Create client
var client = SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'test',
    protocol: 'http'
});

// JSON Data
var data = {
    text: 'test',
    title: 'test'
};

// Update document to Solr server
client.update(data, function(err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.responseHeader);
});

```


## Test & Coverage

```
gulp 
```
