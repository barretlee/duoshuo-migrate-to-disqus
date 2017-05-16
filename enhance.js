'use strict';
var co = require('co');
var parallel = require('co-parallel');
var request = require('request');
var fs = require('fs');
var http = require('http');

var duoshuoKey = 'barretlee';
var data = require('./data/export.json');
var threadKeys = data.threads.filter((item) => {
  return item.thread_key;
}).map((item) => {
  return item.thread_key;
}).filter((key) => {
  return !(
    key.length === 32 &&
    /^[0-9a-z]+$/.test(key) ||
    /(AND|\.\.\/|\.\.\\\\|WHEN|\*|SELECT|CASE|CHR\(|\.ini$|CHAR|-crash-research.|MAKE_SET|entry\/index\.html.|passwd.?|print\(|127.0.0.1|ELT|_get|bxss\.me)/.test(key) ||
    key.length > 100
  )
}).reduce((ret, key) => {
  if (!ret[key]) {
    ret[key] = 1;
  }
  return ret;
}, {});

// fs.writeFileSync('./a', Object.keys(threadKeys).join('\n'));

function* fetch(key) {
  return new Promise((resolve, reject) => {
    var url = `http://${duoshuoKey}.duoshuo.com/api/threads/listPosts.json?thread_key=${key}`;
    request(url, function (error, response, body) {
      if (error) {
        return resolve({});
      }
      let data = {};
      try {
        console.log(`>>>> Fetch: ${url}`);
        data = JSON.parse(body);
        data = data.parentPosts || {};
      } catch(e) {}
      resolve(data);
    });
  });
}

co(function* () {
  const keys = Object.keys(threadKeys);
  const fetchAll = keys.map(fetch);
  const data = yield parallel(fetchAll, 10);
  fs.writeFileSync('./dist/person.json', JSON.stringify(data, null, 2));
});