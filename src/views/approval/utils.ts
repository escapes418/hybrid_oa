import api from '@/assets/api/index.api';
import Common from '@/assets/js/common';
import { WSAEINVALIDPROVIDER } from 'constants';
export default {
  getUserInfos() {
    return new Promise((resolve, reject) => {
      Common.comGetStorage('userInfo').then(baseInfo => {
        resolve({
          ...baseInfo,
          currentDate: Common.timeFormat(new Date().getTime())
        });
      });
    });
  },
  // 获取项目json Promise对象
  getProjectJSON() {
    return new Promise((resolve, reject) => {
      Common.covertHttp(api.queryDictInfo, {
        dictType: 'oa_project'
      }).then((rtn: any) => {
        var dataList = [];
        rtn.data.forEach((item, index) => {
          dataList.push({
            ...item,
            value: item.label,
            key: item.value
          });
        });
        resolve(dataList);
      });
    });
  },
  // 获取主题json Promise对象
  getThemeJSON() {
    // TODO:接口暂时未实现
    return new Promise((resolve, reject) => {
      Common.covertHttp(api.queryDictInfo, {
        dictType: 'oa_project'
      }).then((rtn: any) => {
        var JSON = [];
        rtn.data.forEach((item, index) => {
          JSON.push({
            ...item,
            value: item.label,
            key: item.value
          });
        });
        resolve(JSON);
      });
    });
  },
  // 从json中比对某个值得到另外一个值
  getJSONValueByCompare(fieldName, expectName, val, array) {
    var rtn = '';
    array.forEach((item, index, self) => {
      if (item[fieldName] == val) {
        rtn = item[expectName];
      }
    });
    return rtn;
  },
  valid(_this) {
    var flag = true;
    if (_this.approvalForm.costCenterId == '') {
      _this.$vux.toast.text('请选择成本中心');
      return (flag = false);
    }
    if (_this.approvalForm.applyType == '') {
      _this.$vux.toast.text('请选择报销类型');
      return (flag = false);
    }
    if (_this.approvalForm.applyType != 1) {
      if (_this.approvalForm.relationTheme == '') {
        _this.$vux.toast.text('请关联主题');
        return (flag = false);
      }
    }
    if (_this.approvalForm.applyType == 2) {
      if (_this.approvalForm.employees.length == 0) {
        _this.$vux.toast.text('请选择陪客人员');
        return (flag = false);
      }
    }
    if (_this.approvalForm.taxCity == '') {
      _this.$vux.toast.text('请选择发票公司');
      return (flag = false);
    }
    if (_this.itemDatas.length == 0) {
      _this.$vux.toast.text('请填写报销明细');
      return (flag = false);
    }
    return flag;
  }
};
