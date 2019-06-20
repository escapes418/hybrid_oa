<template>
    <div v-if="isReady">
        <group :title='COST' label-margin-right="1em">
            <cell title="采购成本(元):" inline-desc="(采购价+运费+调度费)*年销售规模">
                <div>
                    <span style="color:#444">{{purchaseCost|numFilter}}</span>
                </div>
            </cell>
            <cell title="税负成本(元):">
                <div>
                    <span style="color:#444">{{taxBurdenCost|numFilter}}</span>
                </div>
            </cell>
            <cell-form-preview :list="list"></cell-form-preview>
            <cell title="总成本(元):" inline-desc="采购成本+税负成本">
                <div>
                    <span style="color:red">{{totalCost|numFilter}}</span>
                </div>
            </cell>
        </group>
        <group :title='INCOME' label-margin-right="1em">
            <cell title="销售收入(元):" inline-desc="电厂结算价*年销售规模">
                <div>
                    <span style="color:blue">{{salesRevenue|numFilter}}</span>
                </div>
            </cell>
        </group>
        <group :title='PROFIT' label-margin-right="1em">
            <cell title="毛利润(元):" inline-desc="销售收入-合计成本">
                <div>
                    <span style="color:green">{{netProfit|numFilter}}</span>
                </div>
            </cell>
            <cell title="利润率(%):" inline-desc="毛利润/销售收入">
                <div>
                    <span style="color:#444 ">{{profitMargin|numFilter}}</span>
                </div>
            </cell>
        </group>
        <!-- <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="submit">计算利润</x-button>
                </flexbox-item>
            </flexbox>
        </box> -->
    </div>
</template>
<script lang="ts">
import com from '@/assets/js/common'
import math from 'mathjs'
import { Group, XInput,Selector, XButton,Box,Flexbox,XTextarea,CellFormPreview,Checklist,Cell,Confirm, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';

import { Vue, Component } from "vue-property-decorator";
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
        CellFormPreview,
        Checklist,
        Cell,
        XTextarea,
    }
})
export default class calcDetail extends Vue {
    isReady = false
    list=[
        {
            label: '增值税(元)',
            value: '3.29',
            name: "VAT",
        }, {
            label: '附加税(元)',
            value: '1.04',
            name: 'surtax',
        }, {
            label: '印花税(元)',
            value: '8.00',
            name: 'stampDuty',
        }, {
            label: '所得税(元)',
            value: '8.00',
            name: 'incomeTax'
        }, {
            label: '税返(元)',
            value: '8.00',
            name: 'taxInverse',
        }
    ]
    purchaseCost = 123123;//采购成本
    taxBurdenCost = 123123;//税负成本
    totalCost = 123.569;//总成本
    salesRevenue = 123.561;//销售收入
    netProfit = 123;//毛利润
    profitMargin = 123//利润率
    calcName = "";//模式
    type = 1;
    created() {
        this.init();
    }
    activated() {
        this.init();
    }
    mounted() {

    }

    get COST(): string {
        if(this.$route.params.type == "1"){
            return "成本-常规模式"
        } else if(this.$route.params.type == "2"){
            return "成本-商城寄售"
        } else if(this.$route.params.type == "3"){
            return "成本-经纪人寄售"
        }
    }

    get INCOME(): string {
        if(this.$route.params.type == "1"){
            return "收入-常规模式"
        } else if(this.$route.params.type == "2"){
            return "收入-商城寄售"
        } else if(this.$route.params.type == "3"){
            return "收入-经纪人寄售"
        }
    }

    get PROFIT(): string {
        if(this.$route.params.type == "1"){
            return "利润-常规模式"
        } else if(this.$route.params.type == "2"){
            return "利润-商城寄售"
        } else if(this.$route.params.type == "3"){
            return "利润-经纪人寄售"
        }
    }
    init(): void {
        com.comGetStorage("calcu").then((res:any) => {
            console.log(res,"计算")
            var that:any = this
            var schedulingService = 0
            var VATin = 0;//增值税(进项) 
            for( let i in res.mode){
                if(res.mode[i].check){
                    this.calcName = res.mode[i].name;
                    this.type = res.mode[i].type
                    schedulingService = math.eval(`(${res.freight}*${res.mode[i].rate/100})`)//调度服务费
                }
            }
            var salesScale = math.eval(`${res.powerPlantSettlementPrice}*${res.annualSales}`);//销项规模
            var VATout = math.eval(`${salesScale}*${res.VATrate}/100/(1+${res.VATrate}/100)`);//增值税(销项)
            console.log(VATout,"增值税(销项)")
            if(this.type == 1){
                VATin = math.eval(`${res.coalPurchasePrice}*${res.VATrate}/100/(1+${res.VATrate}/100)*${res.annualSales}+(${res.freight}+${schedulingService})*${res.freightRate}/100/(1+${res.freightRate}/100)*${res.annualSales}`);
                
            } else if(this.type == 2){
                VATin = math.eval(`(${res.coalPurchasePrice}+${res.freight}+${schedulingService})*${res.annualSales}*${res.VATrate}/100/(${res.VATrate}/100+1)`)
            }else if(this.type == 3){

            }
            console.log(VATin,"增值税(进项)")
            var VATamount = math.eval(`${VATout}-${VATin}`);//增值税额
            var additionalTax = math.eval(`${res.additionalTaxRate}/100*${VATamount}`);//附加税
            var stampDuty = math.eval(`((${res.coalPurchasePrice}+${res.freight}+${schedulingService})*${res.annualSales}+${salesScale})*${res.stampDutyRate}/100`);//印花税
            var taxInverse = math.eval(`${VATamount}*${res.taxInverseRatio}/100`);//税反
            var incomeTax = math.eval(`(${salesScale}+${taxInverse}-(${res.coalPurchasePrice}+${res.freight}+${schedulingService})*${res.annualSales}-(${VATamount}+${additionalTax}+${stampDuty}))*${res.incomeTaxRate}/100`);//所得税
            var totalTax = math.eval(`${VATamount}+${additionalTax}+${stampDuty}-${taxInverse}+${incomeTax}`);//合计税负
            console.log(VATamount,additionalTax,stampDuty,taxInverse,incomeTax,totalTax)
            var profitMargin = math.eval(`${salesScale}-(${res.coalPurchasePrice}+${res.freight}+${schedulingService})*${res.annualSales}-${totalTax}`);//毛利润
            var tradeShare = math.eval(`${salesScale}-${profitMargin}`);//占总贸易额的利润率
            // console.log(profitMargin)
            this.purchaseCost = math.eval(`(${res.coalPurchasePrice}+${res.freight}+${schedulingService})*${res.annualSales}`)
            this.taxBurdenCost = totalTax
            this.totalCost = math.eval(`${that.purchaseCost}+${that.taxBurdenCost}`)
            this.salesRevenue = math.eval(`${res.powerPlantSettlementPrice}*${res.annualSales}`)
            this.netProfit = math.eval(`${that.salesRevenue}-${that.totalCost}`)
            this.profitMargin = math.eval(`${that.netProfit}/${that.salesRevenue}*100`)
            console.log(this.totalCost)
            this.list.forEach((item,index)=>{
                if(item.name == "VAT"){
                    item.value = this.toThousands(VATamount)
                }else if(item.name == "surtax"){
                    item.value = this.toThousands(additionalTax)
                }else if(item.name == "stampDuty"){
                    item.value = this.toThousands(stampDuty)
                }else if(item.name == "incomeTax"){
                    item.value = this.toThousands(incomeTax)
                }else if(item.name == "taxInverse"){
                    item.value = this.toThousands(taxInverse)
                }
            })
            this.isReady = true;
        });
    }
    submit(): void {

    }
    handleApply(): void {

    }
    toThousands(value): any{
        var result = '';
        value = Number(value.toString() || 0).toFixed(2);
        var numAry = value.toString().split(".");
        var preNum = numAry[0];
        var lastNum = numAry[1];
        while (preNum.length > 3) {
            result = ',' + preNum.slice(-3) + result;
            preNum = preNum.slice(0, preNum.length - 3);
        }
        if (preNum) {
            result = preNum + result;
        }
        result=result+"."+lastNum;
        return result;
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