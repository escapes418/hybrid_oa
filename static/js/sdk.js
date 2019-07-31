var deviceInfo = navigator.userAgent.toLowerCase(),
  device;
if (deviceInfo.indexOf('iphone') !== -1) {
  device = 'iphone';
} else if (deviceInfo.indexOf('android') !== -1) {
  device = 'android';
} else {
  device = 'unknow';
}
// console.log(device)
function transObj(obj) {
  if (device == 'iphone') {
    return obj;
  } else {
    return JSON.stringify(obj);
  }
}
var sdk = {
  sendCommand: function(cmd, id, params) {
    if (device == 'iphone') {
      window.webkit.messageHandlers.jstouseoc.postMessage({ cmd: cmd, id: id, params: params });
    } else {
      android.sendCommond(cmd, id, params);
    }
  },
  newsCenter: {},
  globalRecive: function(id, content) {
    var rtn, __flag__;
    // console.log(content.replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t"),"请求数据解析----------")
    try {
      // rtn = JSON.parse(content);
      rtn = JSON.parse(
        content
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/\u0000/g, '\\u0000')
      ); // replace解决字符串中有换行符报错的问题
      __flag__ = true;
    } catch (err) {
      __flag__ = false;
    }
    if (!__flag__) {
      console.error('客户端返参数报错');
      return;
    }
    if (sdk.newsCenter[id]) {
      // navtive 两次调用globalRecive方法，顺序为1.success/fail 2.complete
      if (rtn.callbackType == 'success') {
        sdk.newsCenter[id].success && sdk.newsCenter[id].success(rtn.data);
      } else if (rtn.callbackType == 'fail') {
        sdk.newsCenter[id].fail && sdk.newsCenter[id].fail(rtn.data);
      } else {
        sdk.newsCenter[id].complete && sdk.newsCenter[id].complete(rtn.data);
        delete sdk.newsCenter[id];
      }
    }
  },
  ability: {
    // 调用native能力
    // 获取地理位置
    getLocation: function() {},
    // 查看地理位置
    openLocation: function() {},
    // 获取系统信息
    getSystemInfo: function() {},
    //登录
    login: function(data) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('login', id, JSON.stringify(data));
    },
    //登出
    logout: function() {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('logout', id, '');
    },
    fetchDeviceCode: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('fetchDeviceCode', id, JSON.stringify(params));
    },
    // 调用相机 && 选图
    chooseImage: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('chooseImage', id, JSON.stringify(params));
    },
    // 调用相机 && 选图（多张图）
    uploadImages: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.maxNum = options.maxNum || 1;
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('uploadImages', id, JSON.stringify(params));
    },
    // 扫码
    scanCode: function() {},
    // 拨打电话
    makePhoneCall: function() {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('makePhoneCall', id, JSON.stringify(params));
    },
    // 本地存储相关 --
    setStorage: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.key = options.key || '';
      params.data = options.data || '';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('setStorage', id, JSON.stringify(params));
    },
    // 本地存储相关 --
    getStorage: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.key = options.key || '';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('getStorage', id, JSON.stringify(params));
    },
    // 本地存储相关 --
    removeStorage: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.key = options.key || '';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('removeStorage', id, JSON.stringify(params));
    }
  },
  components: {
    // 调用native控件
    // 显示toast
    showToast: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.title = options.title || '';
      params.duration = options.duration || '1500';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      // console.log(id);
      // console.log(params);
      sdk.sendCommand('showToast', id, JSON.stringify(params));
    },
    // 隐藏toast
    // 显示loading
    showLoading: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.title = options.title || '';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('showLoading', id, JSON.stringify(params));
    },
    // 隐藏loading
    hideLoading: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('hideLoading', id, JSON.stringify(params));
    },
    // 图片预览 --
    previewImage: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.url = options.url || '';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('previewImage', id, JSON.stringify(params));
    },
    // 图片预览(多张)
    previewImages: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.url = options.url || [];
      params.index = options.index || 0;
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('previewImages', id, JSON.stringify(params));
    }
    // 显示模态框
    // 显示上拉菜单
    // 预览图片
  },
  biz: {
    http: function(options) {
      var options = options || {};
      var id = Math.floor(Math.random() * 100000000).toString();
      var params = {};
      params.headers = options.headers || '';
      params.type = options.type || 'normal';
      params.url = options.url || '';
      params.params = options.params || '';
      sdk.newsCenter[id] = {
        id: id,
        success: options.success || '',
        fail: options.fail || '',
        complete: options.complete || ''
      };
      sdk.sendCommand('http', id, JSON.stringify(params));
    }
  }
};
// export default sdk
window.globalRecive = sdk.globalRecive;
