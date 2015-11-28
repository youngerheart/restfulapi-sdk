# restfulapi-sdk
standard restful api sdk with cache

简直是醉了，最近在用vue-resource时不想每次写url，想把写url这里封装一层，然而这个vue-resource由于this的问题老是读不到自己的配置信息，然后我的代码就挂了，很早前就打算写一个这样的东西了，实在是迫不得已！

做一个原生的调用restAPI的工具，加入cache。目前设想的用法如下
      
      var urls = {
        order: '/api/order/:id',
        user: {
          password: '/api/user/:id/password'
        }
      };

      const SDK = require(restfulapi-sdk);
      const API = new SDK(urls);

      var todo1 = API.order.get({
        id: id,
        otherRouteParams: ...
      });

      var todo2 = API.order.get({
        id: id,
        otherRouteParams: ...
      });

      SDK.all([todo1, todo2])
      .cache(() => {
        // success
      }, () => {
        // failed
      }) // 使用到缓存数据时
      .send(() => {}, () => {}); // 使用接口数据时

      API.user.put({
        id: id
      }, {
        newPassword: newPassword
      }).send(() => {}, () => {}); // 使用接口数据时

