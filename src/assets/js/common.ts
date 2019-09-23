import Vue from 'vue';
import XHR from '@/assets/js/XHR';
import axios from '@/assets/api/axios';
import { HasChildren } from './interface';
import { ToastPlugin } from 'vux';
Vue.use(ToastPlugin);
var vueTips: any = new Vue();
// import sdk from "../../../static/js/sdk.js";
// import deepCopy from '@/assets/js/deepCopy.js';
/***********vue 过滤器拓展************/

/*
 * 千分位 过滤器
 * value 进参
 * precision  保留几位小数
 * separator分隔符    分隔符 默认为","
 */
Vue.filter('thousands', function(value, precision, separator) {
  var num = value;
  var parts;
  //判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    num = Number(num);
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
    parts = num.split('.');
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
    return parts.join('.');
  }
  return value;
});
Vue.filter('stamp2TextDate', function(value) {
  if (!value || value == '') return '';
  var date = new Date(value);
  var y: number | string = date.getFullYear();
  var m: number | string = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d: number | string = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
});
Vue.filter('stamp2TextDateFull', function(value) {
  if (!value || value == '') return '';
  var date = new Date(value);
  var y: number | string = date.getFullYear();
  var m: number | string = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d: number | string = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h: number | string = date.getHours();
  var min: number | string = date.getMinutes();
  var sec: any = date.getSeconds();
  h = h < 10 ? '0' + h : h;
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;
  return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec;
});
// Vue.filter("bigMoney", function (value) {
//     if (value == '' || value == 0) {
//         return ''
//     }
//     var fraction = ['角', '分'];
//     var digit = [
//         '零', '壹', '贰', '叁', '肆',
//         '伍', '陆', '柒', '捌', '玖'
//     ];
//     var unit = [
//         ['元', '万', '亿'],
//         ['', '拾', '佰', '仟']
//     ];
//     var head = value < 0 ? '欠' : '';
//     value = Math.abs(value);
//     var s = '';
//     for (var i = 0; i < fraction.length; i++) {
//         s += (digit[Math.floor(value * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
//     }
//     s = s || '整';
//     value = Math.floor(value);
//     for (var i = 0; i < unit[0].length && value > 0; i++) {
//         var p = '';
//         for (var j = 0; j < unit[1].length && value > 0; j++) {
//             p = digit[value % 10] + unit[1][j] + p;
//             value = Math.floor(value / 10);
//         }
//         s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
//     }
//     return head + s.replace(/(零.)*零元/, '元')
//         .replace(/(零.)+/g, '零')
//         .replace(/^整$/, '零元整');
// })
Vue.filter('bigMoney', function(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
});
Vue.filter('numFilter', function(value) {
  var result = '';
  value = Number(value.toString() || 0).toFixed(2);
  var numAry = value.toString().split('.');
  var preNum = numAry[0];
  var lastNum = numAry[1];
  while (preNum.length > 3) {
    result = ',' + preNum.slice(-3) + result;
    preNum = preNum.slice(0, preNum.length - 3);
  }
  if (preNum) {
    result = preNum + result;
  }
  result = result + '.' + lastNum;
  return result;
});
const com = {
  //防抖
  timer: false,
  debounce: function(wait) {
    wait = wait || 300;
    return new Promise((resolve, reject) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        resolve();
      }, wait);
    });
  },
  // debounce:debounce,
  debounceHttp: async function(url: string, params?: any) {
    await this.debounce();
    return com.covertHttp(url, params);
  },
  covertHttp: function(url: string, params?: any, showLoading = true) {
    // var s = JSON.stringify(params);//屏蔽特殊字符
    // if (/[\ud800-\udbff][\udc00-\udfff]/g.test(s)) {
    //   vueTips.$vux.toast.text('请勿填写特殊字符');
    //   return new Promise((resolve, reject) => {
    //     resolve({
    //       status: 1
    //     });
    //   });
    // }
    return axios.post(url, params);
    // if (process.env.NODE_ENV == 'development') {
    //   // 开发
    //   if (process.argv[0] == 'H5') {
    //     // H5 命令行参数
    //     return axios.post(url, params);
    //   } else {
    //     // 混合开发
    //     return XHR.http(url, params, showLoading);
    //   }
    // } else {
    //   // 正式
    //   return XHR.http(url, params, showLoading);
    // }
  },
  hasChildren: function(data: Array<HasChildren>, count: number = 0): Array<HasChildren> {
    data[count].check = '0';
    for (var i = 0; i < data.length; i++) {
      if (data[count].id == data[i].pId) {
        data[count].children = true;
        break;
      } else {
        data[count].children = false;
      }
    }
    count++;
    if (count < data.length) this.hasChildren(data, count);
    return data;
  },
  findParent: function(data, id, arr: any = []): void {
    if (id != 'null') {
      for (var i = 0; i < data.length; i++) {
        if (data[i].id == id) {
          arr.unshift({
            name: data[i].name,
            id: data[i].id
          });
          id = data[i].pId;
          break;
        }
      }
      this.findParent(data, id, arr);
    } else {
      arr.unshift({
        name: '全部',
        id: 'null'
      });
      return arr;
    }
  },
  addTreePeopel: function(data) {
    var d = data;
    var list = com.clone(data);
    d.forEach((item, index) => {
      if (item.userInfo) {
        item.userInfo.forEach((itm, idx) => {
          list.push({
            ...itm,
            pId: item.id
          });
        });
      }
    });
    return list;
  },
  timeParse: function(getDate) {
    if (!getDate) return 0;
    var date = com.clone(getDate);
    date = date.replace(/-/g, '/'); //兼容safari浏览器
    if (isNaN(Date.parse(date))) {
      return 0; //非合法时间字符串返回0
    } else {
      return new Date(date).getTime();
    }
  },
  changeItemtimestamp: function(data, array) {
    var reData = JSON.parse(JSON.stringify(data || []));
    if (reData.length != 0) {
      reData.forEach((i, idx) => {
        array.forEach((item, index) => {
          i[item] = com.timeParse(i[item]);
        });
      });
      return reData;
    } else {
      return [];
    }
  },
  ObjToStamp: function(data, array) {
    if (data.length != 0) {
      data.forEach((i, idx) => {
        array.forEach((item, index) => {
          i[item] = com.timeFormat(i[item]);
        });
      });
      return data;
    } else {
      return [];
    }
  },
  timeFormat: function(date) {
    date ? (date = new Date(date)) : (date = new Date());
    //date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
  },
  timeFormatHour: function(date) {
    date ? (date = new Date(date)) : (date = new Date());
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    return y + '-' + m + '-' + d + ' ' + h;
  },
  formatFullDateTime: function(date) {
    // var date = new Date(inputTime);
    // var Y = date.getFullYear();
    // var M = date.getMonth() + 1;
    // M = M < 10 ? Number('0' + M) : M;
    // var D = date.getDate();
    // D = D < 10 ? Number('0' + D) : D;
    // var h = date.getHours();
    // h = h < 10 ? Number('0' + h) : h;
    // var m = date.getMinutes();
    // m = m < 10 ? Number('0' + m) : m;
    // var s = date.getSeconds();
    // s = s < 10 ? Number('0' + s) : s;
    date ? (date = new Date(date)) : (date = new Date());
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    M = M < 10 ? '0' + M : M;
    var D = date.getDate();
    D = D < 10 ? '0' + D : D;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var m = date.getMinutes();
    m = m < 10 ? '0' + m : m;
    var s = date.getSeconds();
    s = s < 10 ? '0' + s : s;
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  },
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
  addKeepAlive: function(_this) {
    var name = _this.$options.name;
    _this.$store.dispatch('addKeepAlive', name);
  },
  delKeepAlive: function(_this, data) {
    _this.$store.dispatch('delKeepAlive', data);
  },
  delAllKeepAlive: function(_this) {
    _this.$store.dispatch('delAllKeepAlive');
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
  login: function(_this) {
    if (process.env.NODE_ENV == 'development') {
      // 开发
      if (process.argv[0] == 'H5') {
        // H5 命令行参数
      } else {
        var res = JSON.parse(window.localStorage.getItem('sjboacert'));
        sdk.ability.login(res.phone);
      }
    } else {
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
  onlyNum: function(d) {
    if (d == '') {
      return '';
    } else {
      var data = com.clone(d);
      var numArr = data.match(/\d+/g);
      if (numArr == null) {
        return '';
      } else {
        var num = numArr.join('');
        return num;
      }
    }
  }
  // autoSaveTimer:false,
  // autoSave(name,getData){
  //     var count = 0
  //     com.autoSaveTimer = setInterval(()=>{
  //         console.log("autoSave",getData,count++)
  //         com.comSetStorage(name, {data:getData});
  //     },5000)
  // },
  // stopAutoSave() {
  //     clearInterval(com.autoSaveTimer)
  // },
};

export default com;
