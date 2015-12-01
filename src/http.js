const Cache = require('browser-cache');
var config = {
  cache: true,
  isSession: false
};

// 尝试解析json
const parse = (str) => {
  try {
    str = JSON.parse(str);
  } catch(e) {}
  return str;
};

// 根据参数对象生成参数
const getParamStr = (arg) => {
  var paramStr = '';
  for(let key in arg) {
    if(!paramStr) paramStr += key + '=' + arg[key];
    else paramStr += '\&' + key + '=' + arg[key];
  }
  return paramStr;
};

// 解析url和参数
const parseUrl = (url, arg) => {
  var proto = url.match(/:\w+/g);
  proto.forEach((item) => {
    let key = item.replace(':', '');
    if(arg[key]) {
      url = url.replace(new RegExp(item ,'g'), arg[key]);
      delete arg[key];
    } else {
      url = url.replace(new RegExp('/' + item ,'g'), '');
    }
  });
  return url + '?' + getParamStr(arg);
};

// 得到发送请求的函数
const getSendFunc = (arg, method, url) => {
  return function(success, error) {
    const req = new XMLHttpRequest();
    var realUrl = '';
    req.onreadystatechange = () => {
      if(req.readyState === 4) {
        if(req.status >= 200 && req.status < 300) {
          var res = parse(req.responseText);
          if(needCache && method === 'get') {
            // 存入缓存操作
            Cache.save(realUrl, res, config.isSession);
          }
          if(success) success(res, req.status);
        } else {
          if(error) error(parse(req.responseText), req.status);
        }
      }
    };

    var openReq = () => {
      req.open(method, realUrl, true);
      if(method !== 'get') req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    };

    switch(arg.length) {
      case 0:
        realUrl = parseUrl(url, {});
        openReq();
        req.send();
        break;
      case 1:
        realUrl = parseUrl(url, arg[0])
        openReq();
        req.send();
        break;
      case 2:
        realUrl = parseUrl(url, arg[0])
        openReq();
        req.send(getParamStr(arg[1]));
        break;
    }
  };
}

// 得到获取缓存数据的函数
const getCacheFunc = (arg, method, url) => {
  return function(success, error) {
    var realUrl = '';
    var deal = () => {
      Cache.deal(realUrl, (overdue, data) => {
        if(overdue || !data) error(data, overdue);
        else success(data, overdue);
      }, config.isSession);
    };
    switch(arg.length) {
      case 0:
        realUrl = parseUrl(url, {});
        deal();
        break;
      case 1:
      case 2:
        realUrl = parseUrl(url, arg[0]);
        deal();
        break;
    }
  };
};

// 生成四种方法调用函数
const method = (method, url) => {
  return (...arg) => {
    var methodObj = {
      send: getSendFunc(arg, method, url)
    }
    if(method === 'get') methodObj.cache = getCacheFunc(arg, method, url);
    return methodObj;
  }
};

// 生成四种方法
const http = {
  getObj(url) {
    if(!url) return null;
    return {
      get: method('get', url),
      post: method('post', url),
      put: method('put', url),
      del: method('delete', url)
    }
  },
  setConfig(config) {
    if(typeof config === 'undefined' || config.cache) {
      config = config || {};
      Cache.init({
        limit: config.overdue || 3600,
        overdue: config.overdueDay || null,
        prefix: config.cachePrefix || 'api'
      });
      config.isSession = config.isSession || false;
    } else {
      config.cache = false;
    }
  }
}

module.exports = http;
