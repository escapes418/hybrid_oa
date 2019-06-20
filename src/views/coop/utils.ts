export default {
    valiApply(_this){
        var flag = true;
        if (_this.applyData.title == "") {
            _this.$vux.toast.text("请输入标题");
            return (flag = false);
        }
        if (_this.applyData.type == "") {
            _this.$vux.toast.text("请选择类型");
            return (flag = false);
        }
        if (_this.applyData.labelList.length == 0) {
            _this.$vux.toast.text("请选择标签");
            return (flag = false);
        }
        if (_this.applyData.description == "") {
            _this.$vux.toast.text("请输入描述");
            return (flag = false);
        }
        if (_this.applyData.principal == "") {
            _this.$vux.toast.text("请选择当前负责人");
            return (flag = false);
        }
        if (_this.applyData.participantList.length == 0) {
            _this.$vux.toast.text("请选择参与人");
            return (flag = false);
        }
        return flag;
    },
    valiSchedule(_this) {
        var flag = true;
        if (_this.applyData.progressName == "") {
            _this.$vux.toast.text("请选择进度状态");
            return (flag = false);
        }
        if (_this.applyData.progressName == "需求审核中" && _this.applyData.urgency == "") {
            _this.$vux.toast.text("请选择需求紧急度");
            return (flag = false);
        }
        if (_this.applyData.progressName == "需求调研中" && _this.applyData.priority == "") {
            _this.$vux.toast.text("请选择优先级");
            return (flag = false);
        }
        if (_this.applyData.progressName == "产品设计中" && _this.applyData.productEnd.length == 0) {
            _this.$vux.toast.text("请选择产品端");
            return (flag = false);
        }
        if (_this.applyData.progressName == "产品设计中" && _this.applyData.planDesignTime == "") {
            _this.$vux.toast.text("请选择预计设计时间");
            return (flag = false);
        }
        if (_this.applyData.progressName == "开发中" && _this.applyData.planDevTime == "") {
            _this.$vux.toast.text("请选择预计开发时间");
            return (flag = false);
        }
        if (_this.applyData.progressName == "开发中" && _this.applyData.planTestTime == "") {
            _this.$vux.toast.text("请选择预计提测时间");
            return (flag = false);
        }
        if (_this.applyData.progressName == "开发中" && _this.applyData.planReleaseTime == "") {
            _this.$vux.toast.text("请选择预计上线时间");
            return (flag = false);
        }
        if(new Date(_this.applyData.planTestTime) < new Date(_this.applyData.planDevTime)) {
            _this.$vux.toast.text("提测时间不得小于开发时间");
            return;
        }
        if(new Date(_this.applyData.planReleaseTime) < new Date(_this.applyData.planTestTime)) {
            _this.$vux.toast.text("上线时间不得小于提测时间");
            return;
        }
        if (_this.applyData.progressName == "上线" && _this.applyData.actualReleaseTime == "") {
            _this.$vux.toast.text("请选择实际上线时间");
            return (flag = false);
        }
        if (_this.applyData.progressName == "上线" && _this.applyData.trainTime == "") {
            _this.$vux.toast.text("请选择培训时间");
            return (flag = false);
        }
        if (_this.applyData.handleExplain == "") {
            _this.$vux.toast.text("请输入处理说明");
            return (flag = false);
        }
        return flag;
    },
}
