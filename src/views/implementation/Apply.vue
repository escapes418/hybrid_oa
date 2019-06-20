<template>
    <div v-if="isReady">
        <group title='实施需求发起' label-width="7em" label-margin-right="1em" label-align="justify">
            <x-input title="申请人" :value="baseInfo.userName" :readonly='true'></x-input>
            <x-input title="需求主题" v-model="reqData.demandName" placeholder='请输入主题'></x-input>
            <!-- <selector title="需求类型" placeholder='请选择' :options="queryDemand" v-model="reqData.demandType" :value-map="optMap"></selector> -->
            <sinSelector1 sTitle='需求类型' sPlaceholder='请选择' :dataList="queryDemand"  :sendData="reqData.demandType" :selectedItem.sync="reqData.demandType"></sinSelector1>
            <!-- <selector title="归属项目" :options="projectNameOpt" v-model="reqData.projectId" :value-map="optMap2"></selector> -->
            <sinSelector2 sTitle='归属项目' sPlaceholder='请选择' :dataList="projectNameOpt"  :sendData="reqData.projectId" :selectedItem.sync="reqData.projectId"></sinSelector2>
            <!-- <x-input title="归属项目" placeholder='请选择' v-model="reqData.timeLong" @click.native="projectPopup = true" readonly ></x-input> -->
            <!-- <x-address value-text-align="left" title="归属区域" :hide-district="true" v-model="reqData.areaCode" :list="addressData"  placeholder="请选择归属区域"></x-address> -->
            <datetime format="YYYY-MM-DD HH" v-model="reqData.expectDate" :display-format="expectDate" class="data-time" title="期望抵达时间" placeholder="请选择时间"></datetime>
            <x-input title="预计时长" placeholder='请输入预计时长' v-model="reqData.timeLong" ></x-input>
        </group>
        <div v-for="(item, index) in itemDatas" :key="index">
            <group title='预算明细' label-width="6em" label-margin-right="1em" label-align="justify">
                <approval ref="approval" :key='index' :index='index' :itemData="item" :showUploadImg="false" :showBillNum="false"></approval>
            </group>
        </div>
        <div class="add-btn">
            <span class="pointer" @click="addItem">新增明细</span>
        </div>
        <group v-if="showPreExpenseAmt" title='预览汇总' label-width="6em" label-margin-right="1em" label-align="justify">
            <cell title="总额" :value="preExpenseAmt | thousands(2)" value-align="left"></cell>
            <cell title="大写金额" :value="preExpenseAmt | bigMoney" value-align="left"></cell>
        </group>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="isSubmit=true">提交申请</x-button>
                </flexbox-item>
                <flexbox-item v-if="id==0||(id !=0 && demandStatus == 4)">
                    <x-button type="default" @click.native="submit(false)">存为草稿</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <div v-transfer-dom>
            <confirm v-model="isSubmit" title="提交实施需求发起" @on-cancel="isSubmit=false" @on-confirm="submit(true)">
                <p style="text-align:center;">{{ ('确定执行操作?') }}</p>
            </confirm>
        </div>
        <!-- <div v-transfer-dom>
            <popup v-model="projectPopup" height="100%">
                <div class="popup1">
                <group>
                    <cell-box v-for="(el,index) in radio001" @click.native="projectConfirm(index)">
                        <div class="w-100">
                            <div class="disc-text">
                                <div class="long-content">
                                    <span class="disc-title long-title">项目名称</span>
                                    <span class="long-text"></span>
                                </div>
                                <div class="long-content">
                                    <span class="disc-title long-title">归属部门</span>
                                    <span class="long-text">000</span>
                                </div>
                                <div class="long-content">
                                    <span class="disc-title long-title">客户名称</span>
                                    <span class="long-text">0000</span>
                                </div>
                                <div class="long-content">
                                    <span class="disc-title long-title">归属区域</span>
                                    <span class="long-text font-orange">000</span>
                                </div>
                                <div class="long-content">
                                    <span class="disc-title long-title">项目负责人</span>
                                    <span class="long-text">000</span>
                                </div>
                            </div>
                        </div>
                    </cell-box>
                </group>
                <flexbox class="btn-bottom">
                    <flexbox-item>
                        <x-button type="primary" @click.native="projectPopup = false">取消</x-button>
                    </flexbox-item>
                </flexbox>
                </div>
            </popup>
        </div> -->
        
    </div>
</template>
<script>
import Vue from 'vue'
import axios from '@/assets/api/axios'
import XHR from '@/assets/js/XHR';
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import sinSelector from '@/components/sinSelector'
import { mapState, mapGetters } from 'vuex'

import { Tab, TabItem, Group,Radio , Cell, CellBox, Icon, XInput,Selector,  Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm, XAddress, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';


export default {
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Group,
        Cell,
        CellBox,
        Icon,
        Selector,
        Radio,
        XInput,
        Datetime,
        Confirm,
        XButton,
        XAddress,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Popup,
        Box,
        Checklist,
        sinSelector1: sinSelector,
        sinSelector2: sinSelector,
    },
    data() {
        return {
            queryDemand: [],
            optMap: [ 'value','name'],
            optMap2: ['value','label'],
            projectNameOpt: [],
            isSubmit: false,
            showPreExpenseAmt:false,
            inititemDatas: {
                startDate: com.timeFormat(new Date().getTime()),
                // startPoint: "武汉",
                // startPoint:'湖北省 武汉市',
                startPoint:['420000','420100'],
                startPointName:["湖北省","武汉市"],
                endDate: com.timeFormat(new Date().getTime() + 86400000),
                endPoint: ['420000','420100'],
                endPointName:["湖北省","武汉市"],
                firstSub: "06",
                secondSub: "",
                personNum: 1,
                dayNum: 1,
                billNum: 0,
                expenseAmt: 0,
                remarks: "",
            },
            reqData: {
                amountSum: "", //.. 预算总金额
                expectDate: com.timeFormatHour(new Date().getTime()), //发生日期
                // areaCode: ['420000','420100'], //所属区域
                demandName: "",
                demandType: "",
                projectId: "", 
                timeLong: "", //预计时长
                id: "",
            },
            isReady: false,
            billType: 2,//单据类型:1:市场,2:实施,3:报销 ,
            baseInfo: {},
            procInsId:"",
            projectPopup: false,
            id: this.$route.params.id,
            demandStatus: "",
        }
    },
    computed: {
        ...mapState({
            itemDatas: state => state.itemDatas,
            testData: state => state.testData,
            // baseInfo: state => state.baseInfo,
            subsList: state => state.subsList,
            addressData: state => state.addressData,
            subslistKeyVal:state => state.subsListKeyVal,
        }),
        ...mapGetters([
            'preBillNum',
            'preExpenseAmt'
        ])
    },
    created() {
        // 0.清空所有数组
        this.$store.dispatch('delallItemDatas', {});
        // 1.第一次进入给给store赋值
        if (this.subsList.length == 0) {
            
            this.getAllSubjects().then(rtn => {
                this.$store.dispatch('setSubs', rtn);

                var resetArr = [];
                var map = rtn.reduce((acc, val) => { // key->value
                    acc[val.value] = val
                    return acc
                }, {});
                rtn.forEach(val => {
                    if (val.parent != '0') {
                        var parent = map[val.parent]
                        if (!parent.children) {
                            parent.children = [val]
                        } else {
                            parent.children.push(val)
                        }
                    } else {
                        resetArr.push(val)
                    }
                })
                this.$store.dispatch('subslistKeyVal', map);
            });
        }
        this.init();
    },
    methods: {
        checkListChange(value, label) {

        },
        addItem() {
            var obj = Object.assign({}, this.inititemDatas);
            this.$store.dispatch("addItemDatas", obj);
        },
        init() {
            
            var _this = this;
            com.comGetStorage('userInfo').then(res => {
                this.baseInfo = res;
            })
            com.covertHttp(api.queryDemandInfo).then(rtn => {
                if (rtn.status == 0) {
                    // this.queryDemand = rtn.data;
                    rtn.data.forEach((item,index)=>{
                        this.queryDemand.push({
                            ...item,
                            value: item.name,
                            key: item.value,
                        })
                    })
                } else {
                    _this.$vux.toast.text("获取字段数据失败!");
                }
            }) 
            if(this.addressData.length == 0) {//归属区域
                com.covertHttp(api.areaInfo).then(rtn => {
                    this.$store.dispatch('setAddressData', rtn.data);
                })
            }
            com.covertHttp(api.queryDictInfo,{dictType: "oa_project"}).then(rtn => {
                if (rtn.status == 0) {
                    // this.projectNameOpt = rtn.data;
                    rtn.data.forEach((item,index)=>{
                        this.projectNameOpt.push({
                            ...item,
                            value: item.label,
                            key: item.value,
                        })
                    })
                } else {
                    _this.$vux.toast.text("获取字段数据失败!");
                }
            })
            if (this.$route.params.id == 0) {
                // 新增
                // this.addItem();
                this.isReady = true
                if (this.itemDatas) {
                    this.showPreExpenseAmt = this.itemDatas.length == 0 ? false : true;
                } 
            } else {
                // 编辑
                // 处理编辑逻辑
                this.reqData.id = this.$route.params.id;
                com.covertHttp(api.flowDetailDemandImplementOrMarket,{
                    businessId: this.reqData.id,
                    billType: this.billType
                })
                .then(rtn => {
                    if (rtn.status != 0) {
                        this.$vux.toast.text(rtn.message);
                        return;
                    }
                    this.reqData.demandName = rtn.data.demandImplementDetail.demandName;
                    this.reqData.demandType = rtn.data.demandImplementDetail.demandType;
                    this.reqData.projectId = rtn.data.demandImplementDetail.projectId;
                    this.reqData.areaCode = rtn.data.demandImplementDetail.areaCode;
                    this.reqData.expectDate = rtn.data.demandImplementDetail.expectDate;
                    this.reqData.timeLong = rtn.data.demandImplementDetail.timeLong;
                    this.isReady = true
                    this.procInsId = rtn.data.demandImplementDetail.procInsId;
                    this.$store.dispatch("fullItemDatas",rtn.data.budgetDetailList || []);
                    this.demandStatus = rtn.data.demandImplementDetail.demandStatus
                    // console.log(this.inititemDatas)
                    if (this.itemDatas) {
                        this.showPreExpenseAmt = this.itemDatas.length == 0 ? false : true;
                    } 
                })
            }
        },
        getAllSubjects() {
            return new Promise((resolve, reject) => {
                com.covertHttp(api.getSubjects,{isFirst:"0",parSubCode:""}).then(rtn => {
                    if (rtn.status == 0) {
                        resolve(rtn.data.list);
                    } else {
                        this.$vux.toast.text("获取科目失败");
                    }
                })
            })

        },
        submit(flag) {
            this.reqData.amountSum = this.preExpenseAmt;
            if(this.reqData.demandName == '') {
                this.$vux.toast.text("需求主题不能为空!");
                return false;
            }
            if(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(this.reqData.demandName) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(this.reqData.demandName)) {
                this.$vux.toast.text("需求主题不能包含特殊字符!");
                return false;
            }
            if (this.reqData.demandType === true || this.reqData.demandType == '') {
                this.$vux.toast.text("请选择需求类型");
                return false;
            }
            if (this.reqData.projectId === true || this.reqData.projectId == '') {
                this.$vux.toast.text("选择归属项目");
                return false;
            }
            // if(this.itemDatas.length == 0) {
            //     this.$vux.toast.text("请填写报销明细");
            //     return false;
            // }
            if(!/(^[0-9]\d*$)/.test(this.reqData.timeLong) || this.reqData.timeLong == 0) {
                this.$vux.toast.text("预计时长填写有误");
                return false;
            }
            for(var i=0;i<this.itemDatas.length;i++) { // 省市选择兼容处理
                if(this.itemDatas[i].startPoint[1] == null) {
                    this.itemDatas[i].startPoint.splice(1,1);
                }
                if(this.itemDatas[i].endPoint[1] == null) {
                    this.itemDatas[i].endPoint.splice(1,1);
                }
            }
            var postData = {
                ...this.reqData,
                demandBudgetList: this.itemDatas || "",
                procInsId: this.$route.params.id == 0 ? "": this.procInsId ,
            };
            if (!this.valid()) return;
            if (flag) {// 提交
                com.covertHttp(api.demandImplemetApply,postData).then(rtn => {
                    if (rtn.status == 0) {
                        // this.$router.go(-1);
                        this.$vux.toast.text(rtn.message || "申请发起成功!");
                        this.$router.push({path:'/'})
                    } else {
                        // this.$vux.toast.text(rtn.message || "服务异常!");
                    }
                })
            } else {// 草稿
                com.covertHttp(api.saveDemandImplementInfo,postData).then(rtn => {
                    if (rtn.status == 0) {
                        this.$vux.toast.text(rtn.message || "保存草稿成功!");
                        this.$router.push({path:'/'})
                    } else {
                        // this.$vux.toast.text(rtn.message || "服务异常!");
                    }
                })
            }
        },
        valid() { // 整体校验
            var flag = true, _this = this;
            for (var i in _this.itemDatas){
                if(!_this.$refs.approval[i].componentsValid()){
                    flag = false;
                    return
                }
            }
            return flag;
        },
        projectConfirm(idx){
            console.log(idx);
            this.projectPopup = false;
        },
        expectDate(val){
            return val + ":00"
        }
    },
}
</script>
<style lang="less">
@import "../../assets/css/common/reset.fix.less";
@import "../../assets/css/common/base.less";
@import "../../assets/css/index.less";
</style>
<style>
.black{
    color: black;
}
.width-7em{
    width: 7em;
}
.ml-8em{
    margin-left: 8em;
}
.weui-cells{
    margin-top: 0 !important;
}
.btn-bottom{
    position: fixed;
    bottom: 20px;
}
</style>

