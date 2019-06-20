<template>
    <div class="approval">
        <group label-margin-right="1em">
            <box gap="10px 15px">
                <div style="height:26px">
                    <span></span>
                    <span class="fr font-orange" @click="showDelDialog = true">删除</span>
                </div>
            </box>
            <datetime title="发生日期" placeholder="请选择发生日期" format="YYYY-MM-DD" v-model="itemData.startDate" style="text-align='right'" class="data-time"></datetime>
            <x-address title="起点" placeholder="请选择起点" :hide-district="true" v-model="itemData.startPoint" :list="addressData" value-text-align="left"></x-address>
            <datetime title="结束日期" placeholder="请选择结束日期" format="YYYY-MM-DD" v-model="itemData.endDate" class="data-time"></datetime>
            <x-address title="终点" :hide-district="true" v-model="itemData.endPoint" :list="addressData" value-text-align="left" placeholder="请选择起点"></x-address>
            <x-input title="科目" placeholder="请选择" :value="$refs.subjectPicker&&$refs.subjectPicker.getNameValues()" type="text" readonly @click.native="showSubject = true">
                <span slot="label">科目<span class="required">*</span></span>
            </x-input>

            <x-input v-model.number="itemData.personNum" title="人数" placeholder="请填写人数" type="number">
                <span slot="label">人数<span class="required">*</span></span>
            </x-input>
            <x-input v-model.number="itemData.dayNum" title="天数" placeholder="请填写天数" type="number">
                <span slot="label">天数<span class="required">*</span></span>
            </x-input>
            <x-input v-model.number="itemData.expenseAmt" title="报销金额" placeholder="请填写报销金额" type="number"> 
                <span slot="label">报销金额<span class="required">*</span></span>
            </x-input>
            <x-textarea v-model="itemData.remarks" title="备注" placeholder="请输入备注" :max="1000" :rows="3"></x-textarea>
        </group>
        <div v-transfer-dom>
            <confirm v-model="showDelDialog" title="删除报销表单" @on-cancel="showDelDialog = false" @on-confirm="delItem">
                <p style="text-align:center;">{{ ('确定是删除该项报销明细?') }}</p>
            </confirm>
        </div>
        <popup-picker ref='subjectPicker' :show.sync="showSubject" v-model="itemData.subject" :data="subjectData" :columns="2" style="display:none;"></popup-picker>
    </div>
</template>
<script>
import com from "@/assets/js/common";
import XHR from "@/assets/js/XHR";
import { mapState, mapGetters } from "vuex";
import {
    Group,
    PopupPicker,
    Picker,
    XAddress,
    XInput,
    Cell,
    Box,
    Confirm,
    Datetime,
    Selector,
    XButton,
    XTextarea,
    TransferDomDirective as TransferDom
} from "vux";
import api from "@/assets/api/index.api";
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: "RecItem",
    directives: {
        TransferDom
    },
    props: {
        index: Number,
        itemData: Object,
    },
    components: {
        Group,
        PopupPicker,
        XInput,
        Cell,
        Box,
        XButton,
        Confirm,
        Datetime,
        Selector,
        XTextarea,
        XAddress,
        Picker,
    },
    data: function () {
        return {
            showDelDialog: false, // 显示关闭弹窗
            showSubject: false,   // 显示科目弹窗
        };
    },
    created() {

    },
    computed: {
        ...mapState({
            addressData: state => state.addressList,
            subjectData: state => state.subjectList,
        }),
    },
    methods: {
        delItem() {
            this.$store.dispatch("delItemDatas", this.index);
        },
        componentsValid() {
            var flag = true, _this = this;
            
            if (_this.itemData.startPoint.length == 0 || _this.itemData.startPoint[0] == "") {
                _this.$vux.toast.text("起点填写有误");
                flag = false;
                return;
            }
            if (_this.itemData.endPoint.length == 0 || _this.itemData.endPoint[0] == "") {
                _this.$vux.toast.text("终点填写有误");
                flag = false;
                return;
            }
            if (_this.itemData.subject.length == 0) {
                _this.$vux.toast.text("请选择科目");
                flag = false;
                return;
            }
            if (!/(^[0-9]\d*$)/.test(_this.itemData.dayNum) || _this.itemData.dayNum == 0) {
                _this.$vux.toast.text("天数填写有误");
                flag = false;
                return;
            }
            if (!/(^[0-9]\d*$)/.test(_this.itemData.personNum) || _this.itemData.personNum == 0) {
                _this.$vux.toast.text("人数填写有误");
                flag = false;
                return;
            }
            if (!/^[0-9]+(.[0-9]{1,2})?$/.test(_this.itemData.expenseAmt) || _this.itemData.expenseAmt == 0) {
                _this.$vux.toast.text("报销金额填写有误");
                flag = false;
                return;
            }
            if (_this.itemData.startDate == "" || _this.itemData.endDate == "") {
                _this.$vux.toast.text("请选择发生日期或结束日期");
                flag = false;
                return;
            }
            if (new Date(_this.itemData.startDate) > new Date(_this.itemData.endDate)) {
                _this.$vux.toast.text("结束日期不能早于发生日期");
                flag = false;
                return;
            }  
            return flag;
        },
    }
};
</script>
<style lang="less">
.approval{
    .weui-cells{
        margin-top: 0 !important;
    }
    .vux-no-group-title{
        margin-top: 0 !important;
    }
}

</style>

