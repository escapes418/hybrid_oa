<template>
    <div v-if="isReady">
        <group title='实施需求发起'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">申请人员</span>
                            <span class="long-detail font-orange">{{dataDetail.applyPerName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">申请时间</span>
                            <span class="long-detail">{{dataDetail.applyTime}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求主题</span>
                            <span class="long-detail">{{dataDetail.demandName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求类型</span>
                            <span class="long-detail">{{dataDetail.demandTypeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">归属项目</span>
                            <span class="long-detail">{{dataDetail.projectName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">期望抵达时间</span>
                            <span class="long-detail">{{dataDetail.expectDate}}:00</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计时长</span>
                            <span class="long-detail">{{dataDetail.timeLong}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group v-for="(el, index) in dataList" :key="index" title="预算明细">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">发生日期</span>
                            <span class="long-detail">{{el.startDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">起点</span>
                            <span class="long-detail">{{el.startPointName.join(' ')}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">结束日期</span>
                            <span class="long-detail">{{el.endDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">终点</span>
                            <span class="long-detail">{{el.endPointName.join(' ')}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">一级科目</span>
                            <span class="long-detail">{{el.firstSubName}}</span>
                        </div>
                        <div v-if="el.secondSubName"  class="long-content">
                            <span class="detail-title long-title">二级科目</span>
                            <span class="long-detail">{{el.secondSubName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">人数</span>
                            <span class="long-detail">{{el.personNum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">天数</span>
                            <span class="long-detail">{{el.dayNum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">报销金额</span>
                            <span class="long-detail">{{el.expenseAmt|thousands(2)}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{el.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>        
        <group v-if="dataList.length != 0" title="预览汇总">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">总额</span>
                            <span class="long-detail">{{dataDetail.amountSum|thousands(2)}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">大写金额</span>
                            <span class="long-detail">{{dataDetail.amountSum|bigMoney}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group> 
        <group class="examination" v-if="type == 'todo' && dataDetail.demandStatus == 2" title="审批意见" label-width="6em" label-margin-right="1em" label-align="justify">
            <x-textarea v-model="remarkForm.remarks"  placeholder="请输入审批意见" :max="600" :rows="3"></x-textarea>
        </group>
        <group title="审批流程" v-if="dataDetail.demandStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in flowLoglist" :key="index">
                    <div :class="['ml-10',index==flowLoglist.length-1?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            
                            <span v-if="index==0">{{el.activityName}}</span>
                            <span v-else-if="dataDetail.demandStatus==0 && index==flowLoglist.length - 1">{{el.activityName}}</span>
                            <span v-else>{{el.comment?"已审批":"待审批"}}</span>
                        </div>
                        <div class="state-item">
                            <span class="font-size14">{{el.endTime}}</span>
                            <span v-if="el.durationTime" class="state-name">历时:{{el.durationTime}}</span>
                        </div>
                        <p v-if="el.comment" class="font-gray font-size14 mt-2">{{el.comment}}</p>
                    </div>
                </timeline-item>
            </timeline>
        </group>
        <box gap="10px 10px">
            <!-- myself 我发起的进入 -->
            <template v-if="type === 'myself'">
                <flexbox>
                    <!-- 审批草稿 -->
                    <!-- <flexbox-item v-if="dataDetail.demandStatus == 4">
                        <x-button type="primary" @click.native="apply">提交</x-button>
                    </flexbox-item> -->
                    <!-- 审批草稿和审批被拒绝 -->
                    <flexbox-item v-if="dataDetail.isDeit == 1">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <!-- 已完结和已删除的不能删除 -->
                    <flexbox-item v-if="(dataDetail.demandStatus != 1) && (dataDetail.demandStatus != 0)">
                        <x-button type="default" @click.native="del">删除</x-button>
                    </flexbox-item>
                    <!-- 审批中可以撤销 -->
                    <flexbox-item v-if="dataDetail.demandStatus == 2">
                        <x-button type="default" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- 项目主管审批 -->
            <!-- <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="agreeApply">同意</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click.native="refuseApply">驳回</x-button>
                </flexbox-item>
            </flexbox> -->
            <!-- todo 待我审批进入 -->
            <template v-if="type === 'todo'">
                <flexbox v-if="dataDetail.demandStatus == 2">
                    <flexbox-item v-if="dataDetail.isDeit != 1">
                        <x-button type="primary" @click.native="submit('yes')">同意</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="dataDetail.isDeit != 1">
                        <x-button type="warn" @click.native="submit('no')">拒绝</x-button>
                    </flexbox-item>
                </flexbox>
                <flexbox v-if="dataDetail.isDeit == 1">
                    <flexbox-item>
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- done 我已审批进入 -->
            <template v-if="type === 'done'">
                <flexbox v-if="dataDetail.demandStatus == 2">
                    <flexbox-item>
                        <x-button type="default" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
        </box>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from '@/assets/api/axios'
import { mapState, mapGetters } from 'vuex'
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'

import { Tab, TabItem, Group, Selector, Cell, CellBox, Icon, Timeline, TimelineItem, XInput, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist, XAddress, FlexboxItem, ConfirmPlugin, TransferDomDirective as TransferDom} from 'vux';
Vue.use(ConfirmPlugin)
export default {
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Group,
        Cell,
        Selector,
        CellBox,
        XAddress,
        Icon,
        XInput,
        Datetime,
        XButton,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Timeline,
        TimelineItem,
        Popup,
        Box,
        Checklist, 
    },
    data() {
        return {
            billType: 2,//1:市场,2:实施,3:报销 ,
            dataDetail: {},
            queryDemand: [],
            projectNameOpt: [],
            AddressData: [],
            optMap: [ 'value','name'],
            optMap2: ['value','label'],
            dataList: [],
            // preBillNum: 0,
            flowLoglist: [],
            isReady: false,
            type: this.$route.params.type,
            remarkForm: {
                isRemarks: false,
                remarks: '',
            },
        }
    },
    computed: {

    },
    created() {
        this.init()
    },
    methods: {
        checkListChange(value, label) {
            console.log('change', value, label)
        },
        init() {
            var _this = this;
            var params = this.$route.params;
            if (params.id) {
                if (params.type && (params.type === 'todo' || params.type === 'done' || params.type === 'myself')) {
                    this.type = params.type;
                    // api.flowDetailDemandImplementOrMarket({
                    //     businessId: params.id,
                    //     billType: this.billType,
                    //     taskId:this.$route.params.taskId
                    // }).then(rtn => {
                    //     if (rtn.status != 0) {
                    //         this.$vux.toast.text(rtn.message);
                    //         return;
                    //     }
                    //     this.dataDetail = rtn.data.demandImplementDetail;
                    //     this.dataList = rtn.data.budgetDetailList;
                    //     this.dataList.forEach(function(item,idx){
                    //         _this.preBillNum += item.billNum;
                    //     })
                    //     this.flowLoglist = rtn.data.flowLoglist;
                    //     this.isReady = true;
                    // })
                    com.covertHttp(api.flowDetailDemandImplementOrMarket,{
                        businessId: params.id,
                        billType: this.billType,
                        taskId:this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status != 0) {
                            this.$vux.toast.text(rtn.message);
                            return;
                        }
                        this.dataDetail = rtn.data.demandImplementDetail;
                        this.dataList = rtn.data.budgetDetailList || [];
                        // this.dataList.forEach(function(item,idx){
                        //     _this.preBillNum += item.billNum;
                        // })
                        this.flowLoglist = rtn.data.flowLoglist;
                        this.isReady = true;
                    }); 
                } else {
                    console.log('列表type参数异常');
                    console.log(params);
                    this.$router.push({ path: '/userIndex' });
                }

            } else {
                console.log('参数异常');
                console.log(params);
                this.$router.push({ path: '/userIndex' });
            }
        },
        del() { //删除
            var _this = this;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定删除？',
                onCancel () {

                },
                onConfirm () {
                    // api.repealApplyDemandImplementOrMarket({ expenseFlowId: _this.$route.params.id }).then(rtn => {
                    //     if (rtn.status == 0) {
                    //         _this.$vux.toast.text(rtn.message || '删除单据成功');
                    //         _this.$router.go(-1);
                    //     } else {
                    //         _this.$vux.toast.text(rtn.message || '服务器异常');
                    //         return;
                    //     }
                    // })
                    com.covertHttp(api.repealApplyDemandImplementOrMarket,{ expenseFlowId: _this.$route.params.id }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '删除单据成功');
                            _this.$router.go(-1);
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            return;
                        }
                    }); 
                }
            })
        },
        cancel() { //撤销
            // procInsId: this.dataArr.detail.procInsId || ""
            //taskId
            var _this = this;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定撤销？',
                onCancel () {

                },
                onConfirm () {
                    com.covertHttp(api.repealTaskDemanadImplementOrMarket,{
                        procInsId:_this.dataDetail.procInsId,
                        taskId:_this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '流程收回成功');
                            _this.$router.go(-1);
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            return;
                        }
                    });
                }
            })
        },
        editApply() {
            this.$router.push({
                path: '/implementation/apply/' + this.$route.params.id
            });
        },
        apply() {//提交草稿
            var _this = this
            // api.startWorkFlowDemandImplement({ expenseFlowId: this.$route.params.id }).then(rtn => {
            //     if (rtn.status == 0) {
            //         _this.$vux.toast.text(rtn.message || '申请发起成功');
            //         this.$router.go(-1);
            //     } else {
            //         this.$vux.toast.text(rtn.message || '服务器异常');
            //         return;
            //     }
            // })
            com.covertHttp(api.startWorkFlowDemandImplement,{ expenseFlowId: this.$route.params.id }).then(rtn => {
                if (rtn.status == 0) {
                    _this.$vux.toast.text(rtn.message || '申请发起成功');
                    this.$router.go(-1);
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                    return;
                }
            });
        },
        submit(type) { // 同意
            
            if(type == 'no' && this.remarkForm.remarks == '') {
                this.$vux.toast.text("请输入审批意见");
                return;
            }
            var _this = this;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定？',
                onCancel () {

                },
                onConfirm () {
                    // api.completeTaskDemandImplement({
                    //     procInsId:_this.dataDetail.procInsId,
                    //     comment:_this.remarkForm.remarks,
                    //     expenseFormId:_this.dataDetail.id,
                    //     flag:type,
                    // }).then(rtn => {
                    //     if(rtn.status == 0) {
                    //         _this.$vux.toast.text(rtn.message || '审批成功');
                    //         _this.$router.go(-1);
                    //     }
                    // })
                    com.covertHttp(api.completeTaskDemandImplement,{
                        procInsId:_this.dataDetail.procInsId,
                        comment:_this.remarkForm.remarks,
                        expenseFormId:_this.dataDetail.id,
                        flag:type,
                    }).then(rtn => {
                        if(rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '审批成功');
                            _this.$router.go(-1);
                        }
                    });
                }
            })
        },
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
.weui-cells{
    margin-top: 0 !important;
}
.ml-8em{
    margin-left: 8em;
}
.examination .weui-textarea{
    text-align:left !important;
}

</style>

