export default {
    valiApply(_this){
        var flag = true;
        if (_this.applyData.projectName == "" || _this.applyData.projectName == undefined) {
            _this.$vux.toast.text("请输入项目名称");
            return (flag = false);
        }
        if (_this.applyData.projectType == "" || _this.applyData.projectType == undefined) {
            _this.$vux.toast.text("请选择项目类型");
            return (flag = false);
        }
        if (_this.applyData.custInfoId == "" || _this.applyData.custInfoId == undefined) {
            _this.$vux.toast.text("请选择客户名称");
            return (flag = false);
        }
        if (_this.applyData.holderCode == undefined || _this.applyData.holderCode.length == 0) {
            _this.$vux.toast.text("请选择企业名称");
            return (flag = false);
        }
        if (_this.applyData.officeId == "") {
            _this.$vux.toast.text("请选择归属部门");
            return (flag = false);
        }
        if (_this.applyData.marketLeaderId == "") {
            _this.$vux.toast.text("请选择市场负责人");
            return (flag = false);
        }
        if (_this.applyData.projectLeaderId == "") {
            _this.$vux.toast.text("请选择项目负责人");
            return (flag = false);
        }
        if (_this.applyData.impleLeaderId == "") {
            _this.$vux.toast.text("请选择实施负责人");
            return (flag = false);
        }
        if(_this.applyData.projectNodeReqs.length>0){
            _this.applyData.projectNodeReqs.forEach(item=>{
                if(!item.nodeName&&!item.nodeAddress){
                    _this.$vux.toast.text("请填写地点节点或选择节点地址");
                    return (flag = false);
                }
            }) 
        }
        return flag;
    },
    
}
