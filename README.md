# solr-node
Simple Solr Node Client Project

[![NPM](https://nodei.co/npm/solr-node.png?downloads=true&stars=true)](https://nodei.co/npm/solr-node/)

## Install

```
npm install solr-node
```


## Usage

### Create Client
```js
// Require module
var SolrNode = require('solr-node');

// Create client
var client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'test',
    protocol: 'http'
});
```

### Search

```js
// Create query
var strQuery = client.query().q('text:test');
var objQuery = client.query().q({text:'test', title:'test'});
var myStrQuery = 'q=text:test&wt=json';

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

// Search documents using myStrQuery
solrClient.search(myStrQuery, function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.response);
});

```

### Update

```js
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

### Delete

```js
// Delete Query
var strQuery = 'id:testid'
var objQuery = {id:'testid'}

// Delete document using strQuery
client.delete(strQuery, function(err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.responseHeader);
});

// Delete document using objQuery
client.delete(objQuery, function(err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log('Response:', result.responseHeader);
});

```

## Test & Coverage & Docs

```js
gulp 
```
