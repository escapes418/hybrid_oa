export default {
    vali(_this){
        var flag = true;
        if (_this.applyData.userName == "") {
            _this.$vux.toast.text("请输入姓名");
            return (flag = false);
        }
        if (_this.applyData.phone == "") {
            _this.$vux.toast.text("请输入手机号");
            return (flag = false);
        }
        if(!/^[0-9]{1,10}$/.test(_this.applyData.phone)){
            _this.$vux.toast.text("手机号填写有误");
            return (flag = false);
        }
        return flag;
    },
}
