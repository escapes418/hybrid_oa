import com from '@/assets/js/common';
import { WSAEINVALIDPROVIDER } from 'constants';
export default {
  valid(_this) {
    // 整体校验
    var flag = true;
    if (_this.applyData.custId == '') {
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
    if (_this.applyData.companyHolderCode == '') {
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
    // if (_this.applyData.transExpensesPlan == '') {
    //   _this.$vux.toast.text('请输入计划月运费');
    //   return (flag = false);
    // }
    if (!/^([0-9]{1,15})(\.[0-9]{1,2})?$/.test(_this.applyData.transExpensesPlan)) {
      _this.$vux.toast.text('计划月运费填写有误');
      return (flag = false);
    }
    // if (_this.applyData.transExpensesPlan < 0) {
    //   _this.$vux.toast.text('计划月运费填写有误');
    //   return (flag = false);
    // }
    if (_this.applyData.onlinePlanTime == '') {
      _this.$vux.toast.text('请选择计划上线时间');
      return (flag = false);
    }
    //------------------------------------------
    if (_this.applyData.invoiceMode == '') {
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
    if (_this.applyData.projectTrusteeshipt == '') {
      _this.$vux.toast.text('请选择是否托管');
      return (flag = false);
    }
    if (_this.applyData.projectTrusteeshipt == '1' && _this.applyData.trusteeshiptChannel == '') {
      _this.$vux.toast.text('请选择托管渠道');
      return (flag = false);
    }
    //-----------------------------
    if (_this.applyData.selfMarketing == '') {
      _this.$vux.toast.text('请选择是否自营');
      return (flag = false);
    }
    if (_this.applyData.projectAgent == '') {
      _this.$vux.toast.text('请选择是否经纪人');
      return (flag = false);
    }
    if (_this.applyData.truckLeader == '') {
      _this.$vux.toast.text('请选择是否车队长');
      return (flag = false);
    }
    if (_this.applyData.oilGas == '') {
      _this.$vux.toast.text('请选择油气');
      return (flag = false);
    }
    if (_this.applyData.callTruck == '') {
      _this.$vux.toast.text('请选择是否叫车');
      return (flag = false);
    }
    if (_this.applyData.projectTrade == '') {
      _this.$vux.toast.text('请选择是否贸易');
      return (flag = false);
    }
    if (_this.applyData.accountPeriod == '') {
      _this.$vux.toast.text('请选择是否账期');
      return (flag = false);
    }
    if (_this.applyData.networkBusiness == '') {
      _this.$vux.toast.text('请选择是否网商');
      return (flag = false);
    }
    if (_this.applyData.projectTray == '') {
      _this.$vux.toast.text('请选择是否托盘');
      return (flag = false);
    }
    if (_this.applyData.returnPoint == '') {
      _this.$vux.toast.text('请选择是否返点');
      return (flag = false);
    }
    if (
      _this.applyData.returnPoint == '1' &&
      !/^([0-9]{1,5})(\.[0-9]{1,2})?$/.test(_this.applyData.returnPointProportion)
    ) {
      _this.$vux.toast.text('请正确填写返点比例，仅支持最长5位的正数和小数点后两位');
      return (flag = false);
    }

    //--------------------------------------------------
    // if(!this.valiUpload(_this)) return (flag = false);
    return flag;
  },
  vailLinkMan(_this) {
    var flag = true;
    for (let i in _this.linkMan) {
      // if (!_this.$refs.dynamic[i].validDynamic()) return (flag = false);
      if (_this.linkMan[i].linkmanName == '') {
        _this.$vux.toast.text('请输入联系人姓名');
        return (flag = false);
      }
      if (!/^[0-9\u4E00-\u9FA5（）()]+$/.test(_this.linkMan[i].linkmanName)) {
        _this.$vux.toast.text('姓名只允许输入中文，数字，中英文小括号');
        return (flag = false);
      }
      if (_this.linkMan[i].linkmanPhone == '') {
        _this.$vux.toast.text('请输入电话');
        return (flag = false);
      }
      if (_this.linkMan[i].linkmanPost == '') {
        _this.$vux.toast.text('请输入职位');
        return (flag = false);
      }
      if (!/^[0-9\u4E00-\u9FA5（）()]+$/.test(_this.linkMan[i].linkmanPost)) {
        _this.$vux.toast.text('职位只允许输入中文，数字，中英文小括号');
        return (flag = false);
      }
    }
    return flag;
  },
  validDynamic(_this) {
    var flag = true;
    for (let i in _this.$refs.dynamic) {
      if (!_this.$refs.dynamic[i].validDynamic()) return (flag = false);
    }
    return flag;
  },
  valiUpload(_this) {
    var flag = true;
    var attach = com.clone(_this.contractAttachmentList);
    attach.forEach((element, index) => {
      //去掉没有上传图片的
      var uploadArr = element.upload.filter((el, idx) => {
        if (el.url) return true;
      });
      element.upload = uploadArr;
    });
    for (let i in attach) {
      if (attach[i].upload.length < attach[i].mustCount) {
        _this.$vux.toast.text(`${attach[i].attachmentName}至少${attach[i].mustCount}张`);
        flag = false;
        break;
      }
    }
    return flag;
  }
};
