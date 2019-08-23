<template>
    <div v-if="isReady" class="approval_detail">
        <group title='基本信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">流程编号</span>
                            <span class="long-detail">{{dataArr.detail.procCode}}</span>
                        </div>
                        <!-- <div class="long-content">
                            <span class="detail-title long-title">申请人</span>
                            <span class="long-detail font-orange">{{dataArr.detail.applyPerName}}</span>
                        </div> -->
                        <div class="long-content">
                            <span class="detail-title long-title">提交时间</span>
                            <span class="long-detail">{{dataArr.detail.applyTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">客户名称</span>
                            <span class="long-detail">{{dataArr.detail.custName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目名称</span>
                            <span class="long-detail">{{dataArr.detail.projectName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目负责人</span>
                            <span class="long-detail">{{dataArr.detail.newProjectLeaderName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">归属部门</span>
                            <span class="long-detail">{{dataArr.detail.newOfficeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">区域总监</span>
                            <span class="long-detail">{{dataArr.detail.officeLeaderName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">企业名称</span>
                            <span class="long-detail">{{dataArr.detail.companyName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">承运货物</span>
                            <span class="long-detail">{{dataArr.detail.carrierGoodsName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目等级</span>
                            <span class="long-detail">{{dataArr.detail.projectLevelName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目类型</span>
                            <span class="long-detail">{{dataArr.detail.projectTypeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">计划月运费</span>
                            <span class="long-detail">{{dataArr.detail.transExpensesPlan}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">计划上线时间</span>
                            <span class="long-detail">{{dataArr.detail.onlinePlanTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">实施负责人</span>
                            <span class="long-detail">{{dataArr.detail.implyLeaderName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataArr.detail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='一般要求'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">开票方式</span>
                            <span class="long-detail">{{dataArr.detail.invoiceModeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">月开票频次</span>
                            <span class="long-detail">{{dataArr.detail.invoicingFrequency}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">托管</span>
                            <span class="long-detail">{{dataArr.detail.projectTrusteeshiptName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">托管渠道</span>
                            <span class="long-detail">{{dataArr.detail.trusteeshiptChannelName}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='特殊要求'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">自营</span>
                            <span class="long-detail">{{dataArr.detail.selfMarketingName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">经纪人</span>
                            <span class="long-detail">{{dataArr.detail.projectAgentName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">车队长</span>
                            <span class="long-detail">{{dataArr.detail.truckLeaderName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">油气</span>
                            <span class="long-detail">{{dataArr.detail.oilGasName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">叫车</span>
                            <span class="long-detail">{{dataArr.detail.callTruckName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">贸易</span>
                            <span class="long-detail">{{dataArr.detail.projectTradeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">账期</span>
                            <span class="long-detail">{{dataArr.detail.accountPeriodName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">网商</span>
                            <span class="long-detail">{{dataArr.detail.networkBusinessName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">托盘</span>
                            <span class="long-detail">{{dataArr.detail.projectTrayName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">返点</span>
                            <span class="long-detail">{{dataArr.detail.returnPointName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">返点比例（%）</span>
                            <span class="long-detail">{{dataArr.detail.returnPointProportion}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group v-for="(el,idx) in dataArr.detail.projectApprovalLinkman" :key="idx" title='联系人信息' label-margin-right="1em">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">联系人</span>
                            <span class="long-detail">{{el.linkmanName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">联系方式</span>
                            <span class="long-detail">{{el.linkmanPhone}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">职位</span>
                            <span class="long-detail">{{el.linkmanPost}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{el.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='审批意见' v-if="type=='todo'&&(!ISEDIT&&ISME || !ISME)" label-margin-right="1em">
            <x-textarea v-model="comment" placeholder="请输入审批意见" :max="600" :rows="3"></x-textarea>
        </group>
        <!-- <div v-if="ISASSIGN">
            <group title='审批意见' label-margin-right="1em" v-for="(item,idx) in assignStaff" :key='idx'>
                <AssignItem :index="idx" :item="item" :memberList="assignDataList"></AssignItem>
            </group>
        </div> -->
        <!-- <div class="add-btn" v-if="ISASSIGN">
            <span class="pointer" @click="addItem">添加指派人员</span>
        </div> -->
        <group title="审批流程" v-if="dataArr.detail.projectApprovalStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in dataArr.flowLoglist" :key="index">
                    <div :class="['ml-10',el.activityName=='待审批'?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            <span v-if="index==0">{{el.activityName}}</span>
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
            <template v-if="type === 'myself'&&baseInfo.loginName==dataArr.detail.applyPerCode">
                <!-- 审批草稿 -->
                <flexbox>
                    <!-- 审批草稿和审批被拒绝 -->
                    <flexbox-item v-if="ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <!-- 已完结和已删除的不能删除 -->
                    <flexbox-item v-if="(dataArr.detail.projectApprovalStatus != 1) && (dataArr.detail.projectApprovalStatus != 0)">
                        <x-button type="default" :disabled="disDel" @click.native="del">删除</x-button>
                    </flexbox-item>
                    <!-- 审批中可以撤销 -->
                    <flexbox-item v-if="dataArr.detail.projectApprovalStatus == 2&&!ISEDIT">
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- todo 待我审批进入 -->
            <template v-if="type === 'todo'">
                <flexbox v-if="dataArr.detail.projectApprovalStatus == 2">
                    <flexbox-item  v-if="!ISEDIT">
                        <x-button type="primary" :disabled="disAgree" @click.native="agreeApply">同意</x-button>
                    </flexbox-item>
                    <flexbox-item  v-if="!ISEDIT">
                        <x-button type="warn" :disabled="disRefuse" @click.native="refuseApply">拒绝</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- done 我已审批进入 -->
            <template v-if="type === 'done'">
                <flexbox v-if="dataArr.detail.projectApprovalStatus == 2">
                    <flexbox-item>
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
        </box>
        <!-- <box gap="10px 10px">
            <template v-if="type === 'myself'&&ISME">
                <flexbox>
                    <flexbox-item v-if="ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="ISDEL">
                        <x-button type="default" :disabled="disDel" @click.native="del">删除</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="ISCANCEL&&!ISEDIT">
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <template v-if="type === 'todo'">
                <flexbox v-if="dataArr.detail.projectApprovalStatus == 2">
                    <flexbox-item  v-if="!ISEDIT&&ISME || !ISME">
                        <x-button type="primary" :disabled="disAgree" @click.native="agreeApply">同意</x-button>
                    </flexbox-item>
                    <flexbox-item  v-if="ISBACK">
                        <x-button type="warn" :disabled="disRefuse" @click.native="refuseApply">拒绝</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="ISME&&ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <template v-if="type === 'done'">
                <flexbox v-if="dataArr.detail.projectApprovalStatus == 2">
                    <flexbox-item v-if="ISCANCEL">
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
        </box> -->
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import XHR from '@/assets/js/XHR';
import { mapState, mapGetters } from 'vuex'
import sinSelector from "@/components/sinSelector";
import AssignItem from '@/components/AssignItem'
import { Box, Confirm, Group, XButton, Timeline, Selector, TimelineItem, Cell,ConfirmPlugin, CellBox, XTextarea, XInput, XDialog, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "ProjectApprovalDetail",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Confirm,
        Group,
        Selector,
        XButton,
        Timeline,
        TimelineItem,
        Cell,
        CellBox,
        XTextarea,
        XInput,
        XDialog,
        Flexbox,
        FlexboxItem,
        sinSelector,
        AssignItem,
    },
    data() {
        return {
            isReady: false,
            assignDataList:[],
            type: '',
            comment:"",
            remarkForm: {
                isRemarks: false,
                remarks: '',
                flag: 'yes'//yes同意 no拒绝
            },
            assignList:{
                personelNum: "",//满足人数
                remarks: "",//备注
                targetAssign: "",//被指派者人员ID
            },
            dataArr: {},
            disDel: false,
            disCancel: false,
            disRefuse: false,
            disAgree: false,
        }
    },
    computed: {
        // resourcesHandleStatus 1审批结束2审批中3单据被驳回4单据保存
        ISME:function(){//是否为自己
            let result = this.baseInfo.loginName == this.dataArr.detail.applyPerCode ? true : false
            return result
        },
        ISDEL:function(){//删除
            let result = this.dataArr.detail.projectApprovalStatus == 2 || this.dataArr.detail.projectApprovalStatus == 3 || this.dataArr.detail.projectApprovalStatus == 4 ? true : false
            return result
        },
        // ISEDIT:function(){//是否可编辑
        //     let result = this.dataArr.detail.isDeit == 1 ? true :false;
        //     return result
        // },
        ISPUTIN:function(){//查看草稿
            let result = this.dataArr.detail.projectApprovalStatus == 4 ? true :false
            return result
        },
        ISCANCEL:function(){//撤销
            let result = this.dataArr.detail.isCancel == 1 ? true:false
            return result
        },
        ISASSIGN:function(){//可指派
            let result = this.dataArr.detail.isAssign == 1 && this.type == "todo" ? true:false
            return result
        },
        ISBACK:function(){//可驳回
            let result = this.dataArr.detail.isBack == 1 ? true:false
            return result
        },
        ISEDIT: function() {
            let result = this.dataArr.detail.modify == "modify" ? true : false;
            return result;
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = res;
            });

            var params = this.$route.params;
            if (params.id) {
                if (params.type && (params.type === 'todo' || params.type === 'done' || params.type === 'myself')) {
                    this.type = params.type;
                    com.covertHttp(api.projectflowdetail,{
                        projectApprovalFlowId: params.id
                    }).then(rtn => {
                        if (rtn.status != 0) {
                            // this.$vux.toast.text(rtn.message) || "查询不到当前信息";
                            this.$router.push({ path: '/userIndex' });
                            return;
                        }
                        this.dataArr = rtn.data;
                        this.dataArr.detail = rtn.data.projectApprovalFlowResp;
                        this.isReady = true;
                    })
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
        refuseApply() {// 拒绝
            if (!this.comment) {
                this.$vux.toast.text('请输入审批意见');
                return;
            }
            var _this = this;
            this.disRefuse = true;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定驳回？',
                onCancel () {
                    _this.disRefuse = false;
                },
                onConfirm () {
                    com.covertHttp(api.projectcompleteTask,{
                        projectApprovalFlowId: _this.$route.params.id,
                        comment: _this.comment,
                        flag: "no",
                        procInsId: _this.dataArr.detail.procInsId || "",
                        }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ProjectApprovalListRecived","ProjectApprovalListSend"])
                            _this.disRefuse = false;
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            _this.disRefuse = false;
                            return;
                        }
                    })
                }
            })
        },
        agreeApply() {// 同意
            var _this = this;
            this.disAgree = true;
            this.$vux.confirm.show({
                title:'是否同意？',
                onCancel () {
                    _this.disAgree = true;
                },
                onConfirm () {
                    // var AssignData = _this.validAssign();
                    // if(!AssignData.flag) return
                    com.covertHttp(api.projectcompleteTask,{
                        projectApprovalFlowId: _this.$route.params.id,
                        procInsId: _this.dataArr.detail.procInsId || "",//同意或拒绝操作 从详情中取实例id
                        // assignList: AssignData.afterFilterEmptyArr,
                        flag: "yes",
                        comment: _this.comment,
                        }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ProjectApprovalListRecived","ProjectApprovalListSend"])
                            _this.disAgree = true;
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            _this.disAgree = true;
                            return;
                        }
                    })
                }
            })
        },
        validAssign(){
            var flag = true;
            var afterFilterEmptyArr = this.assignStaff.filter((el, idx, array) => {
                if (el.targetAssign || el.personelNum || el.remarks) {
                    return true;
                }
            })
            if(this.ISASSIGN){
                if(this.assignStaff.length == 0){
                    this.$vux.toast.text("请添加指派信息");
                    return flag = false;
                }
                afterFilterEmptyArr.map((el, idx, array) => {
                    if (!el.targetAssign || !el.personelNum ) {
                        this.$vux.toast.text("指派信息不能为空");
                        return flag = false;
                    }
                })
                for (var itm = 0; itm < afterFilterEmptyArr.length; itm++){//联系人不能重复
                    for (var i = 0; i < afterFilterEmptyArr.length; i++){
                        if(afterFilterEmptyArr[itm].targetAssign == afterFilterEmptyArr[i].targetAssign && i != itm){
                            this.$vux.toast.text("不得重复指派");
                            return flag = false;
                        }
                    }
                }
                if(afterFilterEmptyArr.length == 0){
                    this.$vux.toast.text("请指派人员");
                    return flag = false;
                }
            }
            return {flag,afterFilterEmptyArr}
        },
        editApply() {// 编辑
            var _this = this;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确认编辑？',
                onCancel () {
                },
                onConfirm () {
                    _this.$router.push({
                        path: '/projectApproval/apply/' + _this.$route.params.id+'/edit'
                    });
                    // com.delKeepAlive(_this,["ResHandleApply"])
                }
            })
        },
        del() { // 删除
            var _this = this;
            this.disDel = true;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定删除？',
                onCancel () {
                    _this.disDel = false;
                },
                onConfirm () {
                    com.covertHttp(api.projectrepealApply,{
                        projectApprovalFlowId: _this.$route.params.id
                    }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ProjectApprovalListRecived","ProjectApprovalListSend"])
                            _this.disDel = false;
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            _this.disDel = false;
                            return;
                        }
                    })
                }
            })
        },
        cancel() { //撤销
            var _this = this;
            this.disCancel = true;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定撤销？',
                onCancel () {
                    _this.disCancel = false;
                },
                onConfirm () {
                    com.covertHttp(api.projectrepealTask,{
                        procInsId:_this.dataArr.detail.procInsId,
                        taskId:_this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ProjectApprovalListRecived","ProjectApprovalListSend"])
                            _this.disCancel = false;
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            _this.disCancel = false;
                            return;
                        }
                    })
                }
            })
        },
    }
}
</script>
<style lang="less">
.approval_detail{
    .upload-img{
    width: 100px;
    height: 80px;
    padding: 0 120px 10px;
    }
    .upload-img img{
        width: 100%;
        height: 100%;
    }
}
.xdialog-group-textarea{
    .weui-textarea{
        text-align:left !important;
    }
}
</style>
