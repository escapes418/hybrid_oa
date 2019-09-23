export default {
  valiApply(_this) {
    var flag = true;
    if (_this.applyData.projectName == '' || _this.applyData.projectName == undefined) {
      _this.$vux.toast.text('请输入项目名称');
      return (flag = false);
    }
    if (_this.applyData.projectType == '' || _this.applyData.projectType == undefined) {
      _this.$vux.toast.text('请选择项目类型');
      return (flag = false);
    }
    if (_this.applyData.custInfoId == '' || _this.applyData.custInfoId == undefined) {
      _this.$vux.toast.text('请选择客户名称');
      return (flag = false);
    }
    if (_this.applyData.holderCode == undefined || _this.applyData.holderCode.length == 0) {
      _this.$vux.toast.text('请选择企业名称');
      return (flag = false);
    }
    if (_this.applyData.officeId == '') {
      _this.$vux.toast.text('请选择归属部门');
      return (flag = false);
    }
    if (_this.applyData.marketLeaderId == '') {
      _this.$vux.toast.text('请选择市场负责人');
      return (flag = false);
    }
    if (_this.applyData.projectLeaderId == '') {
      _this.$vux.toast.text('请选择项目负责人');
      return (flag = false);
    }
    if (_this.applyData.impleLeaderId == '') {
      _this.$vux.toast.text('请选择实施负责人');
      return (flag = false);
    }
    if (_this.applyData.projectNodeReqs.length > 0) {
      _this.applyData.projectNodeReqs.forEach(item => {
        if (!item.nodeName && !item.nodeAddress) {
          _this.$vux.toast.text('请填写地点节点或选择节点地址');
          return (flag = false);
        }
      });
    }
    return flag;
  },
  valid(_this) {
    // 整体校验
    var flag = true;
    if (_this.applyData.custInfoId == '') {
      _this.$vux.toast.text('请选择客户名称');
      return (flag = false);
    }
    if (_this.applyData.projectName == '') {
      _this.$vux.toast.text('请输入项目名称');
      return (flag = false);
    }
    if (!/^[0-9\u4E00-\u9FA5（）()]+$/.test(_this.applyData.projectName)) {
      _this.$vux.toast.text('项目名称只允许输入中文，数字，中英文小括号');
      return (flag = false);
    }
    if (_this.applyData.holderCode == '') {
      _this.$vux.toast.text('请选择企业名称');
      return (flag = false);
    }
    if (!_this.applyData.carrierGoods || _this.applyData.carrierGoods.length == 0) {
      _this.$vux.toast.text('请选择承运货物');
      return (flag = false);
    }
    if (_this.applyData.projectLevel == '') {
      _this.$vux.toast.text('请选择项目等级');
      return (flag = false);
    }
    if (_this.applyData.projectType == '') {
      _this.$vux.toast.text('请选择项目类型');
      return (flag = false);
    }
    // if (_this.applyData.transExpenssPlan == '') {
    //   _this.$vux.toast.text('请输入计划月运费');
    //   return (flag = false);
    // }
    if (!/^([0-9]{1,15})(\.[0-9]{1,2})?$/.test(_this.applyData.transExpenssPlan)) {
      _this.$vux.toast.text('计划月运费填写有误');
      return (flag = false);
    }
    // if (_this.applyData.transExpenssPlan < 0) {
    //   _this.$vux.toast.text('计划月运费填写有误');
    //   return (flag = false);
    // }
    if (_this.applyData.onlinePlanTime == '') {
      _this.$vux.toast.text('请选择计划上线时间');
      return (flag = false);
    }
    if (_this.applyData.projectManagerId == '') {
      _this.$vux.toast.text('请选择项目管理负责人');
      return (flag = false);
    }
    //------------------------------------------
    if (_this.applyData.generalRequire.invoiceMode == '') {
      _this.$vux.toast.text('请选择开票方式');
      return (flag = false);
    }
    // if (_this.applyData.invoicingFrequency === '') {
    //   _this.$vux.toast.text('请输入月开票频次');
    //   return (flag = false);
    // }
    if (
      _this.applyData.invoicingFrequency === '' ||
      !/^[1-9]\d{0,5}$/.test(_this.applyData.invoicingFrequency)
    ) {
      _this.$vux.toast.text('月开票频次填写有误');
      return (flag = false);
    }
    if (_this.applyData.generalRequire.projectTrusteeshipt == '') {
      _this.$vux.toast.text('请选择是否托管');
      return (flag = false);
    }
    if (
      _this.applyData.generalRequire.projectTrusteeshipt == '1' &&
      _this.applyData.generalRequire.trusteeshiptChannel == ''
    ) {
      _this.$vux.toast.text('请选择托管渠道');
      return (flag = false);
    }
    //-----------------------------
    if (_this.applyData.specialRequire.selfMarketing == '') {
      _this.$vux.toast.text('请选择是否自营');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.projectAgent == '') {
      _this.$vux.toast.text('请选择是否经纪人');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.truckLeader == '') {
      _this.$vux.toast.text('请选择是否车队长');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.oilGas == '') {
      _this.$vux.toast.text('请选择油气');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.callTruck == '') {
      _this.$vux.toast.text('请选择是否叫车');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.projectTrade == '') {
      _this.$vux.toast.text('请选择是否贸易');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.accountPeriod == '') {
      _this.$vux.toast.text('请选择是否账期');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.networkBusiness == '') {
      _this.$vux.toast.text('请选择是否网商');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.projectTray == '') {
      _this.$vux.toast.text('请选择是否托盘');
      return (flag = false);
    }
    if (_this.applyData.specialRequire.returnPoint == '') {
      _this.$vux.toast.text('请选择是否返点');
      return (flag = false);
    }
    if (
      _this.applyData.specialRequire.returnPoint == '1' &&
      !/^([0-9]{1,5})(\.[0-9]{1,2})?$/.test(_this.applyData.specialRequire.returnPointProportion)
    ) {
      _this.$vux.toast.text('请正确填写返点比例，仅支持最长5位的正数和小数点后两位');
      return (flag = false);
    }
    return flag;
  },
  vailLinkMan(_this) {
    var flag = true;
    for (let i in _this.mainProjectContacts) {
      if (_this.mainProjectContacts[i].linkmanName == '') {
        _this.$vux.toast.text('请输入联系人姓名');
        return (flag = false);
      }
      if (!/^[a-zA-Z0-9\u4E00-\u9FA5（）()]+$/.test(_this.mainProjectContacts[i].linkmanName)) {
        _this.$vux.toast.text('联系人只允许输入中文，大小写英文字母，数字，中英文小括号');
        return (flag = false);
      }
      if (_this.mainProjectContacts[i].linkmanPhone == '') {
        _this.$vux.toast.text('请输入电话');
        return (flag = false);
      }
      if (!/^1[3456789][0-9]{9}$/.test(_this.mainProjectContacts[i].linkmanPhone)) {
        _this.$vux.toast.text('电话填写有误');
        return (flag = false);
      }
      if (_this.mainProjectContacts[i].linkmanPost == '') {
        _this.$vux.toast.text('请输入职位');
        return (flag = false);
      }
      if (!/^[a-zA-Z0-9\u4E00-\u9FA5（）()]+$/.test(_this.mainProjectContacts[i].linkmanPost)) {
        _this.$vux.toast.text('职位只允许输入中文，大小写英文字母，数字，中英文小括号');
        return (flag = false);
      }
    }
    return flag;
  },
  validNode(_this) {
    var flag = true;
    if (_this.applyData.projectNodeReqs.length > 0) {
      _this.applyData.projectNodeReqs.forEach(item => {
        if (!item.nodeName && !item.nodeAddress) {
          _this.$vux.toast.text('请填写地点节点或选择节点地址');
          return (flag = false);
        }
      });
    }
    return flag;
  }
};
