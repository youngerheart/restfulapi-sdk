const http = require('./http');

// 遍历url对象，生成api对象。
const walk = function(obj) {
  for(var key in obj) {
    if(typeof obj[key] === 'object') {
      walk(obj[key]);
    } else if(typeof obj[key] === 'string') {
      var url = obj[key];
      obj[key] = (function(url) {
        return http(url);
      })(url);
    }
  }
};

// 深拷贝对象
const copy = function(obj) {
  var newObj = {};
  const walk = (obj, newObj) => {
    for(var key in obj) {
      if(typeof obj[key] === 'object') {
        newObj[key] = {}
        walk(obj[key], newObj[key]);
      } else if(typeof obj[key] === 'string') {
        newObj[key] = obj[key];
      }
    }
  };
  walk(obj, newObj);
  return newObj;
};

// 生成SDK对象
const SDK = function(url) {
  var api = copy(url);
  walk(api);
  return api;
};

module.exports = SDK;
