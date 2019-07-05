const com = {
  timer: false,
  comSetStorage: function(key, data) {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
        window.localStorage.setItem(key, JSON.stringify(data));
      } else {
        // 混合开发
        com.setStorage(key, data);
      }
    } else {
      // 正式
      com.setStorage(key, data);
    }
  },
  setStorage: function(key, data) {
    return new Promise((resolve, reject) => {
      sdk.ability.setStorage({
        key: key,
        data: data,
        success(status) {
          resolve();
        }
      });
    });
  },
  comGetStorage: function(key) {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
        return new Promise((resolve, reject) => {
          resolve(JSON.parse(window.localStorage.getItem(key)));
        });
      } else {
        // 混合开发
        return com.getStorage(key).then((res: Ajax.AjaxResponse) => {
          return new Promise((resolve, reject) => {
            if (res.status == 0) {
              resolve(res.data);
            } else {
              reject(res);
            }
          });
        });
      }
    } else {
      // 正式
      return com.getStorage(key).then((res: Ajax.AjaxResponse) => {
        return new Promise((resolve, reject) => {
          if (res.status == 0) {
            resolve(res.data);
          } else {
            reject(res);
          }
        });
      });
    }
  },
  getStorage: function(key) {
    return new Promise((resolve, reject) => {
      sdk.ability.getStorage({
        key: key,
        success(data) {
          resolve(data);
        },
        fail(data) {
          resolve(data);
        },
        complete(data) {}
      });
    });
  },
  comRemoveStorage: function(key) {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
        return new Promise((resolve, reject) => {
          var d: any = window.localStorage.removeItem(key);
          resolve(d);
        });
      } else {
        // 混合开发
        return com.removeStorage(key).then((res: Ajax.AjaxResponse) => {
          return new Promise((resolve, reject) => {
            if (res.status == 0) {
              resolve(res.data);
            }
          });
        });
      }
    } else {
      // 正式
      return com.removeStorage(key).then((res: Ajax.AjaxResponse) => {
        return new Promise((resolve, reject) => {
          if (res.status == 0) {
            resolve(res.data);
          }
        });
      });
    }
  },
  removeStorage: function(key) {
    return new Promise((resolve, reject) => {
      sdk.ability.removeStorage({
        key: key || '',
        success(data) {
          resolve(data);
        },
        fail(data) {
          // console.log('fail', data)
        },
        complete(data) {
          // console.log('complete', data)
        }
      });
    });
  },
  clone: function(obj) {
    // undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）
    return JSON.parse(JSON.stringify(obj));
  },

  logout: function() {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
        // com.comRemoveStorage('sjboacert');
        window.localStorage.removeItem('sjboacert');
        com.comRemoveStorage('autoSave');
      } else {
        // 混合开发
        // com.comRemoveStorage('sjboacert');
        window.localStorage.removeItem('sjboacert');
        com.comRemoveStorage('autoSave');
        sdk.ability.logout();
      }
    } else {
      // 正式
      // com.comRemoveStorage('sjboacert');
      window.localStorage.removeItem('sjboacert');
      com.comRemoveStorage('autoSave');
      sdk.ability.logout();
    }
  },
  AppLogin: function(_this, phone) {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
      } else {
        // 混合开发
        sdk.ability.login({
          data: {
            phone: phone
          },
          status: '0'
        });
      }
    } else {
      // 正式
      sdk.ability.login({
        data: {
          phone: phone
        },
        status: '0'
      });
    }
  },
  delAllKeepAlive: function(_this) {
    _this.$store.dispatch('delAllKeepAlive');
  },
  login: function(_this) {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
      } else {
        // 混合开发
        // com.getStorage('sjboacert').then((res: Ajax.AjaxResponse) => {
        //   if (res.status == 0) {
        //     // 获取本地数据成功
        //     sdk.ability.login(res);
        //   } else {
        //     sdk.ability.logout();
        //     com.delAllKeepAlive(_this);
        //     _this.$router.push({ path: '/login' });
        //   }
        // });
        var res = JSON.parse(window.localStorage.getItem('sjboacert'));
        sdk.ability.login(res.phone);
      }
    } else {
      // 正式
      // com.getStorage('sjboacert').then((res: Ajax.AjaxResponse) => {
      //   if (res.status == 0) {
      //     // 获取本地数据成功
      //     sdk.ability.login(res);
      //   } else {
      //     sdk.ability.logout();
      //     com.delAllKeepAlive(_this);
      //     _this.$router.push({ path: '/login' });
      //   }
      // });
      var res = JSON.parse(window.localStorage.getItem('sjboacert'));
      sdk.ability.login(res.phone);
    }
  },
  isH5: function() {
    if (process.argv[0] == 'H5') {
      // H5 命令行参数
      return true;
    } else {
      // 混合开发
      return false;
    }
  },
  isApp: function(key = 'key', data = { data: 'data' }) {
    return new Promise((resolve, reject) => {
      sdk.ability.setStorage({
        key: key,
        data: data,
        success(status) {
          resolve();
        }
      });
    });
  }
};

export default com;
