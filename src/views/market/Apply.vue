<template>
    <div v-if="isReady">
        <group title='市场需求申请' label-width="7em" label-margin-right="1em" label-align="justify">
            <x-input title="申请人" :max="50" :value="baseInfo.userName" :readonly='true'></x-input>
            <x-input title="需求主题" :max="50" v-model.trim="approvalForm.demandName" :readonly='isReadonly' placeholder='请输入主题'></x-input>
            <!-- <selector title="需求类型" placeholder='请选择' :options="queryDemand" :readonly='isReadonly' v-model="approvalForm.demandType" :value-map="optMap"></selector> -->
            <sinSelector1 sTitle='需求类型' sPlaceholder='请选择' :dataList="queryDemand"  :sendData="approvalForm.demandType" :selectedItem.sync="approvalForm.demandType"></sinSelector1>
            <!-- <selector title="归属项目" :options="projectNameOpt" v-model="approvalForm.projectId" :readonly='isReadonly' :value-map="optMap2"></selector> -->
            <sinSelector1 sTitle='归属项目' sPlaceholder='请选择' :dataList="projectNameOpt"  :sendData="approvalForm.projectId" :selectedItem.sync="approvalForm.projectId"></sinSelector1>
            <x-input title="需求人数" :max="50" v-model.trim="approvalForm.demandPersonelNum" :readonly='isReadonly' ></x-input>
            <datetime format="YYYY-MM-DD HH" title="期望抵达时间" :display-format="expectDate" v-model.trim="approvalForm.expectDate" class="data-time" :readonly='isReadonly'  placeholder="请选择发生日期"></datetime>
            <x-input title="预计时长" :max="50" v-model.trim="approvalForm.timeLong" :readonly='isReadonly' ></x-input>
            <x-input title="预算总额" :max="50" v-model.trim="approvalForm.amountSum" :readonly='isReadonly'></x-input>
            <x-textarea title="备注" placeholder='请输入备注' v-model.trim="approvalForm.remarks" :readonly='isReadonly' :rows="1" :autosize="true" class="readonly-color-textarea"></x-textarea>
        </group>
        <group v-if="isReadonly" v-for="(item, index) in itemDatas" :key="index" title='预算明细' label-width="6em" label-margin-right="1em" label-align="justify">
            <approval ref="approval" :key='index' :index='index' :showUploadImg="false" :itemData="item" :showBillNum="false"></approval>
        </group>
        <div class="add-btn" v-if="isReadonly">
            <span class="pointer" @click="addItem">新增明细</span>
        </div>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="isSubmit=true">提交申请</x-button>
                </flexbox-item>
                <flexbox-item v-if="id==0||(id !=0 && demandStatus == 4)">
                    <x-button type="default" @click.native="refuseApply">存为草稿</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <div v-transfer-dom>
            <confirm v-model="isSubmit" title="提交市场需求申请" @on-cancel="isSubmit=false" @on-confirm="submit(true)">
                <p style="text-align:center;">{{ ('确定执行操作?') }}</p>
            </confirm>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from '@/assets/api/axios'
import XHR from '@/assets/js/XHR';
import com from '@/assets/js/common'
import sinSelector from '@/components/sinSelector'
import api from '@/assets/api/index.api'
import { mapState, mapGetters } from 'vuex'
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';


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
            addressDataList: [],
            isSubmit:false,
            areaName: [],
            demandStatus: "",
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
            approvalForm:{
                demandName:'', // 需求主题
                demandType:'', // 需求类型
                projectId:'', // 项目ID
                // areaCode:['420000','420100'], // 归属区域
                demandPersonelNum:'',// 需求人数
                expectDate:com.timeFormatHour(new Date().getTime()), // 期望抵达时间
                timeLong:'',// 预计时长
                amountSum:'',// 预算总金额
                remarks:'',// 备注
            },
            // expectDate:com.timeFormatHour(new Date().getTime()) + ":00",
            procInsId: "",
            isReadonly: false,//当发起长流程的自下而上时可以进行编辑报销明细、前半段为false，后半段为true
            isReady: false,
            baseInfo: {},
            id: this.$route.params.id,
            projectPopup: false,
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
        this.getAddressData();
    },
    methods: {
        init() {
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
                    this.$vux.toast.text("获取字段数据失败!");
                }
            })
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
                    this.$vux.toast.text("获取字段数据失败!");
                }
            })
            this.getDetail();
        },
        addItem() {
            var obj = Object.assign({}, this.inititemDatas);
            this.$store.dispatch("addItemDatas", obj);
        },
        getDetail() {
            if (this.$route.params.id != 0) {
                var params = this.$route.params;
                // api.flowDetailDemandImplementOrMarket({
                //     businessId: params.id,
                //     billType:1,
                //     taskId:params.taskId
                // })
                com.covertHttp(api.flowDetailDemandImplementOrMarket,{
                    businessId: params.id,
                    billType:1,
                    taskId:params.taskId
                })
                .then(rtn => {
                    if(rtn.status == 0) {
                        this.approvalForm = Object.assign({}, {
                            demandName: rtn.data.demandImplementDetail.demandName,
                            projectId: rtn.data.demandImplementDetail.projectId,
                            demandType: rtn.data.demandImplementDetail.demandType,
                            areaCode: rtn.data.demandImplementDetail.areaCode,
                            demandPersonelNum: rtn.data.demandImplementDetail.demandPersonelNum,
                            expectDate:rtn.data.demandImplementDetail.expectDate,
                            timeLong: rtn.data.demandImplementDetail.timeLong,
                            amountSum: rtn.data.demandImplementDetail.amountSum,
                            remarks: rtn.data.demandImplementDetail.remarks,
                        })
                        this.areaName = rtn.data.demandImplementDetail.areaName;
                        this.procInsId = rtn.data.demandImplementDetail.procInsId;
                        this.demandStatus = rtn.data.demandImplementDetail.demandStatus;
                        //当前环节是否能够填写明细数据 （0允许，1不允许）
                        this.isFillDetail(rtn.data.demandImplementDetail.isFillDetail,rtn.data.budgetDetailList)
                    } else {
                        // this.$vux.toast.text(rtn.message || '服务器异常');
                    }
                })
            }
            this.isReady = true;
        },
        //当前环节是否能够填写明细数据 （0不允许，1允许）
        isFillDetail(type,budgetDetailList) {
            if(type == 1) {
                this.isReadonly = true;
                this.isReady = true     
            }
            if( type == 1 && budgetDetailList && budgetDetailList.length > 0) {
                this.$store.dispatch('fullItemDatas', budgetDetailList);
            } else {
                this.addItem()
            }
        },
        getAddressData() {
            if(this.addressData.length == 0) {
                com.covertHttp(api.areaInfo).then(rtn => {
                    this.$store.dispatch('setAddressData', rtn.data);
                })
            }
        },
        submit() {
            if(this.isReadonly) {
                var _this = this;
                if (!this.valid()) return;                   
                com.covertHttp(api.completeTaskDemandMarket,{
                    comment: "",
                    procInsId:_this.procInsId,
                    demandManagementBudgetList: this.itemDatas,
                    expenseFormId:_this.$route.params.id,
                    flag:"yes",
                    taskId: _this.$route.params.taskId,
                })
                .then(rtn => {
                    if(rtn.status == 0) {
                        this.$router.push({path:'/userIndex'});
                    }
                })
                   
                
            } else {
                if(this.vail()) {
                    com.covertHttp(api.demandMarketApply,this.approvalForm).then(rtn => {
                        if(rtn.status == 0) {
                        this.$router.push({path:'/userIndex'});
                        } else {
                            // this.$vux.toast.text(rtn.message || '服务器异常');
                        }
                    })
                }
            }
            
        },
        vail() {
            if(this.approvalForm.demandName == '') {
                this.$vux.toast.text("需求主题不能为空!");
                return false;
            }
            if(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(this.approvalForm.demandName) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(this.approvalForm.demandName)) {
                this.$vux.toast.text("需求主题不能包含特殊字符!");
                return false;
            }
            if(this.approvalForm.demandType === true || this.approvalForm.demandType == '') {
                this.$vux.toast.text("请选择需求类型");
                return false;
            }
            if(this.approvalForm.projectId === true || this.approvalForm.projectId == '') {
                this.$vux.toast.text("请选择归属项目");
                return false;
            }
            if(!/(^[0-9]\d*$)/.test(this.approvalForm.demandPersonelNum) || this.approvalForm.demandPersonelNum == 0) {
                this.$vux.toast.text("需求人数填写有误");
                return false;
            }
            if(this.approvalForm.expectDate == '') {
                this.$vux.toast.text("期望抵达时间填写有误");
                return false;
            }
            if(!/(^[0-9]\d*$)/.test(this.approvalForm.timeLong) || this.approvalForm.timeLong == 0) {
                this.$vux.toast.text("预计时长填写有误");
                return false;
            }
            if(!/^[0-9]+(.[0-9]{1,2})?$/.test(this.approvalForm.amountSum) || this.approvalForm.amountSum < 0) {
                this.$vux.toast.text("预算总额填写有误");
                return false;
            }
            if(this.approvalForm.remarks == "") {
                this.$vux.toast.text("备注不能为空");
                return false;
            }
            return true;
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
        refuseApply() {
            var id = this.id == 0? '':this.id;
            if(this.vail()) {
                com.covertHttp(api.saveDemandMarketInfo,
                {
                    ...this.approvalForm,
                    id:id
                }
                ).then(rtn => {
                    if(rtn.status == 0) {
                       this.$router.go(-1);
                    } else {
                    //    this.$vux.toast.text(rtn.message || '服务器异常');
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

