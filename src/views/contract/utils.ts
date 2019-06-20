import com from '@/assets/js/common';
import {
    WSAEINVALIDPROVIDER
} from 'constants';
export default {
    valid(_this) {
        // 整体校验
        var flag = true;
        if (_this.applyData.contractNameId == "") {
            _this.$vux.toast.text("请选择合同名称");
            return (flag = false);
        }
        if (_this.associationMain==1) {
            if (_this.applyData.associationMainId == "") {
                _this.$vux.toast.text("请关联主合同");
                return (flag = false);
            }
        }
        if (_this.applyData.projectIds.length == 0&&_this.associationMain!=1) {
            _this.$vux.toast.text("请关联项目");
            return (flag = false);
        }
        if(!this.validDynamic(_this)) return (flag = false);
        if (_this.applyData.signLeaderId == "") {
            _this.$vux.toast.text("请选择合同签约人");
            return (flag = false);
        }
        if (_this.applyData.contractStartTime == "") {
            _this.$vux.toast.text("请选择开始日期");
            return (flag = false);
        }
        if (_this.applyData.contractEndTime == "") {
            _this.$vux.toast.text("请选择结束日期");
            return (flag = false);
        }
        if(_this.applyData.contractEndTime != '' && new Date(_this.applyData.contractEndTime) < new Date(_this.applyData.contractStartTime)) {
            _this.$vux.toast.text("结束日期需大于开始日期");
            return (flag = false);
        }
        if (_this.applyData.signLeaderId == "") {
            _this.$vux.toast.text("请选择合同签约人");
            return (flag = false);
        }
        if (_this.applyData.contractLeaderId == "") {
            _this.$vux.toast.text("请选择合同负责人");
            return (flag = false);
        }
        if (_this.applyData.expressCompany == "") {
            _this.$vux.toast.text("请输入快递公司");
            return (flag = false);
        }
        if (_this.applyData.expressBill == "") {
            _this.$vux.toast.text("请输入快递单号");
            return (flag = false);
        }
        if(!this.valiUpload(_this)) return (flag = false);
        return flag;
    },
    validDynamic(_this) {
        var flag = true;
        for (let i in _this.$refs.dynamic) {
            if (!_this.$refs.dynamic[i].validDynamic()) return (flag = false);    
        }
        return flag
    },
    valiUpload(_this) {
        var flag = true;
        var attach = com.clone(_this.contractAttachmentList);
        attach.forEach((element,index)=>{ //去掉没有上传图片的
            var uploadArr =  element.upload.filter((el,idx)=>{
                if(el.url) return true
            })
            element.upload = uploadArr
        })
        for(let i in attach){
            if(attach[i].upload.length<attach[i].mustCount){
                _this.$vux.toast.text(`${attach[i].attachmentName}至少${attach[i].mustCount}张`);
                flag = false;
                break
            }
        }
        return flag
    },
}
