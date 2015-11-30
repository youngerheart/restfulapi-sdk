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
    if(!paramStr) paramStr += '?' + key + '=' + arg[key];
    else paramStr += '&' + key + '=' + arg[key];
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
  return url + getParamStr(arg);
};

// 得到发送请求的函数
const getSendFunc = (arg, method, url) => {
  return (success, error) => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if(req.readyState === 4) {
        if(req.status >= 200 && req.status < 300) {
          if(success) success(parse(req.responseText));
        } else {
          if(error) error(parse(req.responseText));
        }
      }
    };
    switch(arg.length) {
      case 0:
        req.open(method, parseUrl(url, {}), true);
        req.send();
        break;
      case 1:
        req.open(method, parseUrl(url, arg[0]), true);
        req.send();
        break;
      case 2:
        req.open(method, parseUrl(url, arg[0]), true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(getParamStr(arg[1]));
        break;
    }
  };
}

// 得到获取缓存数据的函数
const getCacheFunc = (arg, method, url) => {
  return (success, error) => {};
};

// 生成四种方法调用函数
const method = (method, url) => {
  return (...arg) => {
    return {
      send: getSendFunc(arg, method, url),
      cache: getCacheFunc(arg, method, url)
    }
  }
};

// 生成四种方法
const http = (url) => {
  if(!url) return null;
  return {
    get: method('get', url),
    post: method('post', url),
    put: method('put', url),
    del: method('delete', url)
  }
};

module.exports = http;
