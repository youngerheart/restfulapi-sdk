const APISDK = require('./../dist/index.js');

var urls = {
  order: '/api/order/:id',
  user: {
    password: '/api/user/:id/password'
  }
};

var config = {
  urlPrefix: 'api/',
  cache: false,
  cachePrefix: 'api',
  overdueDay: 1
};

module.exports = new APISDK(urls, config);
