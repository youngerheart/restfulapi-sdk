const Cache = require('browser-cache');
const Promise = require('./promise');

var config = {
  needCache: true,
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
const getParamStr = (params) => {
  var paramStr = '';
  for(let key in params) {
    if(!paramStr) paramStr += key + '=' + params[key];
    else paramStr += '\&' + key + '=' + params[key];
  }
  return paramStr;
};

// 解析url和参数
const parseUrl = (url, params) => {
  var proto = url.match(/:\w+/g);
  proto && proto.forEach((item) => {
    let key = item.replace(':', '');
    if(params[key]) {
      url = url.replace(new RegExp(item ,'g'), params[key]);
      delete params[key];
    } else {
      url = url.replace(new RegExp('/' + item ,'g'), '');
    }
  });
  var paramStr = getParamStr(params);
  return url + (paramStr ? '?' + paramStr : '');
};

// 得到获取缓存数据的函数
const getCacheFunc = (url, args, defer) => {
  var realUrl = '';
  var deal = () => {
    Cache.deal(realUrl, (overdue, data) => {
      if(overdue || !data) {
        // 请求接口数据
        getSendFunc('get', url, args, defer);
      } else {
        setTimeout(() => {
          defer(true, data, 200);
        });
      } 
    }, config.isSession);
  };
  switch(args.length) {
    case 0:
      realUrl = parseUrl(url, {});
      deal();
      break;
    case 1:
    case 2:
      realUrl = parseUrl(url, args[0]);
      deal();
      break;
  }
};

// 生成调用接口的函数
const getSendFunc = (method, url, args, defer) => {
  // 直接调用接口
  const req = new XMLHttpRequest();
  var realUrl = '';
  req.onreadystatechange = () => {
    if(req.readyState === 4) {
      if(req.status >= 200 && req.status < 300) {
        var res = parse(req.responseText);
        if(config.needCache && method === 'get') {
          // 存入缓存操作
          Cache.save(realUrl, res, config.isSession);
        }
        defer(true, res, req.status);
      } else {
        defer(false, parse(req.responseText), req.status);
      }
    }
  };

  var openReq = () => {
    req.open(method, realUrl, true);
    if(method !== 'get') req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  };

  switch(args.length) {
    case 0:
      realUrl = parseUrl(url, {});
      openReq();
      req.send();
      break;
    case 1:
      realUrl = parseUrl(url, args[0]);
      openReq();
      req.send();
      break;
    case 2:
      realUrl = parseUrl(url, args[0]);
      openReq();
      req.send(getParamStr(args[1]));
      break;
  }
};

const getInitMethod = (method, url) => {
  return (...args) => {
    return new Promise(getSendFunc, method, url, args);
  };
};

// 生成四种方法
const http = {
  getObj(url) {
    if(!url) return null;
    return {
      get: getInitMethod('get', url),
      post: getInitMethod('post', url),
      put: getInitMethod('put', url),
      del: getInitMethod('delete', url),
      cache: (...args) => {
        return new Promise(getCacheFunc, url, args);
      },
    };
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
      config.needCache = true;
    } else {
      config.needCache = false;
    }
  }
};

module.exports = http;
