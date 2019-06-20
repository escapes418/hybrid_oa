<template>
    <div v-if="isReady">
        <group title='输入贸易数据' label-margin-right="1em">
            <x-input title="煤炭采购价" type="number" v-model.trim="form.coalPurchasePrice" placeholder='请输入'>
                <span slot="right" >(元/吨)</span>
            </x-input>
            <x-input title="运费" type="number" v-model.trim="form.freight" placeholder='请输入'>
                <span slot="right" >(元/吨)</span>
            </x-input>
            <x-input title="物流调度费/平台服务费" type="number" v-model.trim="form.schedulingFee" readonly>
                <span slot="right" >(元/吨)</span>
            </x-input>
            <div v-for="(item, index) in form.mode" :key="index">
                <cell disabled @click.native="clickCheck(index,item)" class="link linkbroder">
                    <span slot="title" class="font-orange">
                        <span style="vertical-align:middle;color:#222;">{{item.name}}</span>
                    </span>
                    <x-icon class="linkicon" v-if="item.check" slot="icon" type="ios-checkmark" size="25"></x-icon>
                    <x-icon class="linkicon" v-else slot="icon" type="ios-checkmark-outline" size="25"></x-icon>
                    <input class="linkinput" type="number" placeholder='请输入' v-model.trim="item.rate">
                </cell>
            </div>
            <x-input title="电厂结算价" type="number" v-model.trim="form.powerPlantSettlementPrice" placeholder='请输入'>
                <span slot="right" >(元/吨)</span>
            </x-input>
            <x-input title="年销量" type="number" v-model.trim="form.annualSales" placeholder='请输入'>
                <span slot="right" >(吨/年)</span>
            </x-input>
            <x-input title="增值税税率" type="number" v-model.trim="form.VATrate" placeholder='请输入'>
                <span slot="right" >(%)</span>
            </x-input>
            <x-input title="运费税率" type="number" v-model.trim="form.freightRate" placeholder='请输入'>
                <span slot="right" >(%)</span>
            </x-input>
            <x-input title="附加税税率" type="number" v-model.trim="form.additionalTaxRate" placeholder='请输入'>
                <span slot="right" >(%)</span>
            </x-input>
            <x-input title="印花税税率" type="number" v-model.trim="form.stampDutyRate" placeholder='请输入'>
                <span slot="right" >(%)</span>
            </x-input>
            <x-input title="税返比例" type="number" v-model.trim="form.taxInverseRatio" placeholder='请输入'>
                <span slot="right" >(%)</span>
            </x-input>
            <x-input title="所得税税率" type="number" v-model.trim="form.incomeTaxRate" placeholder='请输入'>
                <span slot="right" >(%)</span>
            </x-input>
            
            
        </group>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="submit">计算利润</x-button>
                </flexbox-item>
            </flexbox>
        </box>
    </div>
</template>
<script lang="ts">
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import Utils from './utils';
import math from 'mathjs'
import { QUERYDICT,APPLY_data,OPTION,TREELIST,I_Dictionary} from "./interface";
import { Group, XInput,Selector, XButton,Box,Flexbox,XTextarea,Checklist,Cell,Confirm, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';

import { Vue, Component, Watch } from "vue-property-decorator";
@Component({
    components: {
        Group,
        Selector,
        XInput,
        Confirm,
        XButton,
        Flexbox,
        FlexboxItem,
        Box,
        Checklist,
        Cell,
        XTextarea,
    }
})
export default class calcForm extends Vue {
    isReady = false
    form = {
        coalPurchasePrice: 300,//煤炭采购价
        freight: 170,//运费
        schedulingFee: "",//物流调度费/平台服务费
        powerPlantSettlementPrice: 500,//电厂结算价
        annualSales: 1,//年销量
        VATrate: 16,//增值税税率
        freightRate: 10,//运费税率
        additionalTaxRate: 12,//附加税税率
        stampDutyRate: 0.03,//印花税税率
        taxInverseRatio: 0, //税反比例
        incomeTaxRate: 0, //所得税税率
        mode : [
            {
                name: "常规模式-调度费费率(%)",
                check: true,
                rate:"",
                type:1,
            },
            {
                name: "商城寄售-服务费费率(%)",
                check: false,
                rate:"",
                type:2,
            },
            // {
            //     name: "经纪人寄售-服务费单价(元/吨)",
            //     check: false,
            //     rate:2,
            //     type:3,
            // }
        ],
    }
    
    @Watch('form.freight')
    formFreightChange(val: any, oldVal: any) {
        for(let i in this.form.mode){
            if(this.form.mode[i].check){
                this.form.schedulingFee = math.eval(`${this.form.mode[i].rate}/100*${this.form.freight}`).toFixed(2);//增值税额
            }
        }
    }

    @Watch('form.mode',{deep: true})
    formModeChange(val: any, oldVal: any) {
        for(let i in this.form.mode){
            if(this.form.mode[i].check){
                this.form.schedulingFee = math.eval(`${this.form.mode[i].rate}/100*${this.form.freight}`).toFixed(2);//增值税额
            }
        }
    }

    private created() {
        this.isReady = true;
        com.addKeepAlive(this)
    }
    private mounted() {

    }

    private submit(): void {
        var _this = this
        if (!Utils.valiApply(this)) return; //校验  
        this.$vux.confirm.show({
            title: "是否计算",
            content: "确定执行操作？",
            onCancel() {},
            onConfirm() {
                _this.handleApply();
            }
        });
    }
    private async handleApply() {
        await com.comSetStorage('calcu', this.form);
        for(let i in this.form.mode){
            if(this.form.mode[i].check){
                var type = this.form.mode[i].type
            }
        }
        this.$router.push({
            path: "/calcu/detail/" + type
        });
    }
    private clickCheck(index,item): void {
        if (this.form.mode[index].check == false) {
            for (let i in this.form.mode) {
                if (index == i) {
                    this.form.mode[i].check = true;
                } else {
                    this.form.mode[i].check = false;
                }
            }
        }
        for(let i in this.form.mode){
            if(this.form.mode[i].check){
                this.form.schedulingFee = math.eval(`${this.form.mode[i].rate}/100*${this.form.freight}`).toFixed(2);//增值税额
            }
        }
    }
}

</script>
<style scoped lang="less">
.link {
    position: relative;
    .linkicon {
        display: inline-block;
        margin-right: 5px;
        fill: orange;
        margin-bottom: -8px;
    }
    .font-select{
        color:rgb(255,233,184)
    }
    .linknext{
        position: absolute;
        width: 65px;
        height: 44px;
        top: 0;
        right: 0;
        box-sizing: border-box;
        padding-top: 10px;
        padding-right: 15px;
    }
    .linkinput{
        position: absolute;
        width: 65px;
        height: 44px;
        top: 0;
        right: 15px;
        border:none;
        text-align:right;
    }
}
// .linkbroder:after{
//     content: '';
//     position: absolute;
//     bottom: 0px;
//     left: 0px;
//     right: 0px;
//     border-bottom: 1px solid #D9D9D9;
//     -webkit-transform: scaleY(0.5);
//     -webkit-transform-origin: 0 0;
// }

</style>