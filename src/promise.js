// 一个简单的实现
// 传入一个函数与它的参数，在函数中声明时可加上最后一个参数defer, 为一个回调，调用方式为:
// defer(true, params) // 触发下一轮的success函数
// defer(false, params) // 触发下一轮的error函数

class Promise {
  constructor(todoFunc, ...args) {
    this.list = [];
    this.status = 0; // 当前处理的状态(未处理, 通过与拒绝)
    this.index = -1; // 处理到第几个then
    this.data = null; // 当期的数据
    this.runFunc(todoFunc, ...args);
  };

  // 顺序处理then
  runFunc(todoFunc, ...args) {
    if(todoFunc) todoFunc(...args, (resolve, ...newArgs) => {
      var {list, index} = this;
      if(newArgs) this.data = Array.isArray(newArgs) ? newArgs : [newArgs];
      if(resolve) {
        this.status = 0;
        if(list[index]) list[index][0](...this.data);
      } else {
        this.status = 1;
        if(list[index]) list[index][1](...this.data);
      }
      this.index ++;
      // 如果有的话，处理then的数组
      if(list[this.index]) {
        var func = list[this.index][this.status];
        this.runFunc(func, ...this.data);
      }
    });
  };

  // 链式push then数组
  then(...item) {
    this.list.push(item);
    return {
      then: (...item) => {
        this.then(...item);
      }
    };
  };
}

module.exports = Promise;
