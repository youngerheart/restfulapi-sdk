class Refer {
  constructor(todoFunc, ...args) {
    this.success = null;
    this.error = null;
    todoFunc(...args, (resolve, ...newArgs) => {
      newArgs = Array.isArray(newArgs) ? newArgs : [newArgs];
      if(resolve && this.success) {
        this.success(...newArgs);
      }
      else if(!resolve && this.error) {
        this.error(...newArgs);
      }
    });
  };

  then(success, error) {
    if(success) this.success = success;
    if(error) this.error = error;
    return {
      then: (todoFunc, ...args) => {
        return new Promise(todoFunc, ...args);
      }
    };
  };
}

module.exports = Refer;
