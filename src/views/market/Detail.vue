<template>
    <div v-if="isReady">
        <group title='市场需求申请'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">申请人员</span>
                            <span class="long-detail font-orange">{{dataArr.detail.applyPerName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">申请时间</span>
                            <span class="long-detail">{{dataArr.detail.applyTime}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求主题</span>
                            <span class="long-detail">{{dataArr.detail.demandName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求类型</span>
                            <span class="long-detail">{{dataArr.detail.demandTypeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">归属项目</span>
                            <span class="long-detail">{{dataArr.detail.projectName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求人数</span>
                            <span class="long-detail">{{dataArr.detail.demandPersonelNum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">期望抵达时间</span>
                            <span class="long-detail">{{dataArr.detail.expectDate}}:00</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计时长</span>
                            <span class="long-detail">{{dataArr.detail.timeLong}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预算总额</span>
                            <span class="long-detail">{{dataArr.detail.amountSum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataArr.detail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group v-if="dataArr.budgetDetailList" v-for="(el, index) in dataArr.budgetDetailList" :key="index" title="预算明细">
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
        <!-- 审批流程(草稿中不显示流程 - 本身也为空)-->
        <group title="审批流程" v-if="dataArr.detail.demandStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in dataArr.flowLoglist" :key="index">
                    <div :class="['ml-10',index==dataArr.flowLoglist.length-1?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            <span>{{el.activityName}}</span>
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
        <group v-if="dataArr.detail.isAssign == 1" title="指派对象" label-width="6em" label-margin-right="1em" label-align="justify">
            <checklist  label-position="left" :options="employeeList" v-model="groupLeaderlist" @on-change="checkListChange"></checklist>
        </group>

        <group class="examination" v-if="type === 'todo' && dataArr.detail.isFillDetail != 1" title="审批意见" label-width="6em" label-margin-right="1em" label-align="justify">
            <x-textarea  placeholder="请输入审批意见" v-model="remarkForm.remarks" :max="600" :rows="3"></x-textarea>
        </group>
        <box gap="10px 10px">
            <template v-if="type === 'myself'">
                <flexbox>
                    <!-- <flexbox-item v-if="dataArr.detail.demandStatus == 4">
                        <x-button type="primary" @click.native="apply">提交</x-button>
                    </flexbox-item> -->
                    <flexbox-item v-if="dataArr.detail.isDeit == 1">
                        <x-button type="primary" @click.native = "edit">编辑</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="(dataArr.detail.demandStatus != 1) && (dataArr.detail.demandStatus != 0)">
                        <x-button type="default" @click.native = 'del'>删除</x-button>
                    </flexbox-item>
                    <!-- 审批中可以撤销 -->
                    <flexbox-item v-if="dataArr.detail.isBack == 1">
                        <x-button type="default" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- todo 待我审批进入 -->
            <template v-if="type === 'todo'">
                <!--指派 -->
                <flexbox>
                    <flexbox-item v-if="dataArr.detail.isFillDetail != 1">
                        <x-button type="primary" @click.native="submit('yes')">同意</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="dataArr.detail.isBack">
                        <x-button type="default" @click.native="submit('no')">驳回</x-button>
                    </flexbox-item>
                </flexbox>
                <flexbox v-if="dataArr.detail.isFillDetail == 1">
                    <flexbox-item>
                        <x-button type="primary" @click.native="edit">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <template v-if="type === 'done'">
                <flexbox v-if="dataArr.detail.demandStatus == 2 && dataArr.detail.isAssign == 0">
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
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'
import XHR from "@/assets/js/XHR";

import { Tab, TabItem, Group, Cell,Timeline,TimelineItem, CellBox, Icon, XInput, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';


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
        XInput,
        Datetime,
        Timeline,
        TimelineItem,
        XButton,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Popup,
        Box,
        Checklist,
    },
    data() {
        return {
            employeeList: [],
            groupLeaderlist: [],

            isReady: false,
            type: '',
            remarkForm: {
                isRemarks: false,
                remarks: '',
            },
            dataArr: {}
        }
    },
    computed: {
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            var params = this.$route.params;
            if (params.id) {
                if (params.type && (params.type === 'todo' || params.type === 'done' || params.type === 'myself')) {
                    this.type = params.type;
                    com.covertHttp(api.flowDetailDemandImplementOrMarket,{
                        businessId: params.id,
                        billType:1,
                        taskId:this.$route.params.taskId
                    }).then(rtn => {
                        this.dataArr.detail = rtn.data.demandImplementDetail;
                        this.dataArr.flowLoglist = rtn.data.flowLoglist || [];
                        this.dataArr.budgetDetailList = rtn.data.budgetDetailList || [];
                        if(this.dataArr.detail.isAssign == 1 && this.dataArr.detail.employeeList) {
                            for(var i=0;i<this.dataArr.detail.employeeList.length;i++) {
                                var obj = this.dataArr.detail.employeeList[i];
                                obj.key = this.dataArr.detail.employeeList[i].loginName;
                                obj.value = this.dataArr.detail.employeeList[i].name;
                                this.employeeList.push(obj)
                            }
                        }
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
        checkListChange(value, label) {
            console.log('change', value, label)
        },
        submit(type) { // 同意
            if(this.dataArr.detail.isAssign == 1 && this.groupLeaderlist.length == 0) {
                this.$vux.toast.text("请选择指派对象");
                return;
            }
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
                    // api.completeTaskDemandMarket({
                    //     procInsId:_this.dataArr.detail.procInsId,
                    //     comment:_this.remarkForm.remarks,
                    //     employees:_this.groupLeaderlist,
                    //     expenseFormId:_this.dataArr.detail.id,
                    //     flag:type,
                    // }).then(res => {
                    //     if(res.status == 0) {
                    //         _this.$router.go(-1);
                    //     }
                    // })
                    com.covertHttp(api.completeTaskDemandMarket,{
                        procInsId:_this.dataArr.detail.procInsId,
                        comment:_this.remarkForm.remarks,
                        employees:_this.groupLeaderlist,
                        expenseFormId:_this.dataArr.detail.id,
                        taskId:_this.$route.params.taskId,
                        flag:type,
                    }).then(rtn => {
                        if(rtn.status == 0) {
                            _this.$router.go(-1);
                        }
                    });
                }
            })
        },
        apply() {//提交草稿
            var _this = this
            // api.startWorkFlowDemandMarket({ expenseFlowId: this.$route.params.id }).then(rtn => {
            //     if (rtn.status == 0) {
            //         _this.$vux.toast.text(rtn.message || '申请发起成功');
            //         this.$router.go(-1);
            //     } else {
            //         this.$vux.toast.text(rtn.message || '服务器异常');
            //         return;
            //     }
            // })
            com.covertHttp(api.startWorkFlowDemandMarket,{ expenseFlowId: this.$route.params.id }).then(rtn => {
                if (rtn.status == 0) {
                    _this.$vux.toast.text(rtn.message || '申请发起成功');
                    this.$router.go(-1);
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                    return;
                }
            });
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
                    // api.repealTaskDemanadImplementOrMarket({
                    //     procInsId:_this.dataArr.detail.procInsId,
                    //     taskId:_this.$route.params.taskId
                    // }).then(rtn => {
                    //     if (rtn.status == 0) {
                    //         _this.$vux.toast.text(rtn.message || '流程收回成功');
                    //         _this.$router.go(-1);
                    //     } else {
                    //         _this.$vux.toast.text(rtn.message || '服务器异常');
                    //         return;
                    //     }
                    // })
                    com.covertHttp(api.repealTaskDemanadImplementOrMarket,{
                        procInsId:_this.dataArr.detail.procInsId,
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
        edit() { // 编辑
            this.$router.push({path:'/market/Apply/' + this.$route.params.id + "/"+this.$route.params.taskId})
        },
        del() { // 取消
            var _this = this;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定删除？',
                onCancel () {

                },
                onConfirm () {
                    // api.repealApplyDemandImplementOrMarket({ expenseFlowId: _this.$route.params.id }).then(rtn => {
                    //     if (rtn.status == 0) {
                    //         _this.$router.go(-1);
                    //     } else {
                    //         _this.$vux.toast.text(rtn.message || '服务器异常');
                    //         return;
                    //     }
                    // })
                    com.covertHttp(api.repealApplyDemandImplementOrMarket,{ expenseFlowId: _this.$route.params.id }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            return;
                        }
                    });
                }
            })
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
    margin-top:0 !important; 
}
.examination .weui-textarea{
    text-align:left !important;
}
</style>

