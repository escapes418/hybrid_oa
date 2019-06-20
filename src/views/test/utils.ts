export default {
    valiMarketApply(_this){
        var flag = true;
        if (_this.applyData.custIntentionCount == "" || _this.applyData.custIntentionCount == undefined) {
            _this.$vux.toast.text("请输入当日意向数量");
            return (flag = false);
        }
        if(!/^[0-9]{1,10}$/.test(_this.applyData.custIntentionCount)){
            _this.$vux.toast.text("当日意向数量填写有误");
            return (flag = false);
        }
        if (_this.applyData.custSignCount == "" || _this.applyData.custSignCount == undefined) {
            _this.$vux.toast.text("请输入当日签约数量");
            return (flag = false);
        }
        if(!/^[0-9]{1,10}$/.test(_this.applyData.custSignCount)){
            _this.$vux.toast.text("当日签约数量填写有误");
            return (flag = false);
        }
        if (_this.applyData.afterVisitCount == "" || _this.applyData.afterVisitCount == undefined) {
            _this.$vux.toast.text("请输入明日拜访数量");
            return (flag = false);
        }
        if(!/^[0-9]{1,10}$/.test(_this.applyData.afterVisitCount)){
            _this.$vux.toast.text("明日拜访数量填写有误");
            return (flag = false);
        }
        if (_this.applyData.afterDailyPlan == "") {
            _this.$vux.toast.text("请输入明日工作计划");
            return (flag = false);
        }
        for(let i in _this.applyData.dailyCustMaintenanceList){
            if(_this.applyData.dailyCustMaintenanceList[i].custId == ""){
                _this.$vux.toast.text("请选择客户名称");
                return (flag = false);
            }
        }
        if (_this.sendToList.length == 0) {
            _this.$vux.toast.text("请选择发送对象");
            return (flag = false);
        }
        return flag;
    },
    ImpApply(_this){
        var flag = true;
        if (_this.applyData.todayWork == "") {
            _this.$vux.toast.text("请输入今日工作");
            return (flag = false);
        }
        if (_this.applyData.transportPoolBuild == "") {
            _this.$vux.toast.text("请输入运力池建设");
            return (flag = false);
        }
        if (_this.applyData.revisitProjectStatus == "") {
            _this.$vux.toast.text("请输入回访项目情况");
            return (flag = false);
        }
        if (_this.applyData.needAssistProblem == "") {
            _this.$vux.toast.text("请输入需要协助问题");
            return (flag = false);
        }
        if (_this.applyData.todayThought == "") {
            _this.$vux.toast.text("请输入今日感想");
            return (flag = false);
        }
        for(let i in _this.applyData.projectImplementStatusList){
            if(_this.applyData.projectImplementStatusList[i].projectId == ""){
                _this.$vux.toast.text("请选择项目名称");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].nodeId == ""){
                _this.$vux.toast.text("请选择节点");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].nodeName == ""|| _this.applyData.projectImplementStatusList[i].nodeName == undefined){
                _this.$vux.toast.text("该节点名称不全");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].nodeAddress == "" || _this.applyData.projectImplementStatusList[i].nodeAddress == undefined){
                _this.$vux.toast.text("该节点无具体地址");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].nodeEmpNum == "" || _this.applyData.projectImplementStatusList[i].nodeEmpNum == undefined){
                _this.$vux.toast.text("请输入节点人数");
                return (flag = false);
            }
            if(!/^[0-9]{1,10}$/.test(_this.applyData.projectImplementStatusList[i].nodeEmpNum)){
                _this.$vux.toast.text("节点人数填写有误");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].nodeEmpNames == ""){
                _this.$vux.toast.text("请输入节点具体人员");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].hasAbnormalStatus == ""){
                _this.$vux.toast.text("请选择异常情况");
                return (flag = false);
            }
            if(_this.applyData.projectImplementStatusList[i].anomalyDescription == "" &&_this.applyData.projectImplementStatusList[i].hasAbnormalStatus == "1"){
                _this.$vux.toast.text("请输入具体异常说明");
                return (flag = false);
            }
        }
        if (_this.sendToUserList.length == 0) {
            _this.$vux.toast.text("请选择发送对象");
            return (flag = false);
        }
        return flag;
    },
}
