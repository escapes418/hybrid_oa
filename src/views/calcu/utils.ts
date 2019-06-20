export default {
    valiApply(_this){
        var flag = true;
        
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.coalPurchasePrice)) {
            _this.$vux.toast.text("煤炭采购价填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.freight)) {
            _this.$vux.toast.text("运费填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.schedulingFee)) {
            _this.$vux.toast.text("物流调度费/平台服务费填写有误");
            return (flag = false);
        }
        for(let i in _this.form.mode){
            if(_this.form.mode[i].check&&!/(^\d+(\.\d+)?$)/.test(_this.form.mode[i].rate)){
                _this.$vux.toast.text(`${_this.form.mode[i].name}填写有误`);
                flag = false;
                break
            }
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.powerPlantSettlementPrice)) {
            _this.$vux.toast.text("电厂结算价填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.annualSales)) {
            _this.$vux.toast.text("年销量填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.VATrate)) {
            _this.$vux.toast.text("增值税税率填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.freightRate)) {
            _this.$vux.toast.text("运费税率填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.additionalTaxRate)) {
            _this.$vux.toast.text("附加税税率填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.stampDutyRate)) {
            _this.$vux.toast.text("印花税税率填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.taxInverseRatio)) {
            _this.$vux.toast.text("税返比例填写有误");
            return (flag = false);
        }
        if (!/(^\d+(\.\d+)?$)/.test(_this.form.incomeTaxRate)) {
            _this.$vux.toast.text("所得税税率填写有误");
            return (flag = false);
        }
        return flag;
    },
    
}
