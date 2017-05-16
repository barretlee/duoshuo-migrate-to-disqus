var fs = require('fs');
var data = require('./data/export.json');
var person = require('./data/person.json');

person = person.reduce((ret, item) => {
  if (item.length > 0) {
    return ret;
  }
  for (var key in item) {
    ret[key] = {
      post_id: item[key].post_id,
      thread_id: item[key].thread_id,
      author: item[key].author || {}
    };
  }
  return ret;
}, {});

data.posts = data.posts.map((item) => {
  var p = person[item.post_id];
  if (item.post_id && p) {
    if (item.thread_id == p.thread_id) {
      for (var key in p.author) {
        item[key] = p.author[key];
      }
    }
  }
  return item;
});

fs.writeFileSync('./data/merge.json', JSON.stringify(data, null, 2));