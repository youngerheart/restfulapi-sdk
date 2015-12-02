# restfulapi-sdk
standard restful api sdk with cache

## usage

      $ npm install restfulapi-sdk
      $ bower install restfulapi-sdk // or use bower

Include `sdk.min.js` in `/dist` by tag , you can also require js by `require('restfulapi-sdk')`

      var urls = {
        order: '/api/order/:id',
        user: {
          password: '/api/user/:id/password'
        }
      };

      var config = {
        cache: false, // open cache, default false (only valid with get method)
        cachePrefix: 'api', // prefix, default 'api'
        overdue: 3600, // cache time, unit second, default 3600
        overdueDay: null, // cache days number，prior to overdue，default null
        isSession: false // use sessionStorage for cache or not
      };

      const APISDK = require('restfulapi-sdk');
      const API = new APISDK(urls, config);

      var todo1 = API.order.get({
        id: id,
        otherRouteParams: ...
      });

      var todo2 = API.order.get({
        id: id,
        otherRouteParams: ...
      });

      APISDK.all([todo1, todo2])
      .cache(() => { // while use cache data
        // success
      }, () => {
        // no data or overdue
      })
      .send((res, resCode) => {}, (err, resCode) => {}); // while use api data

      API.user.put({
        id: id
      }, {
        newPassword: newPassword
      }).send(() => {}, () => {}); // while use api data


## develop

      $ clone restfulapi-sdk && make dev // then view http://localhost:8888


