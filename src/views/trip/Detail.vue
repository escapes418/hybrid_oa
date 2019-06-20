<template>
    <div v-if="isReady" class="approval_detail">
        <group title='出差申请'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">流程编号</span>
                            <span class="long-detail">{{dataArr.detail.procCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">申请人</span>
                            <span class="long-detail font-orange">{{dataArr.detail.applyPerName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">关联主题</span>
                            <span class="long-detail">{{dataArr.detail.relationThemeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目名称</span>
                            <span class="long-detail">{{dataArr.detail.projectName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目负责人</span>
                            <span class="long-detail">{{dataArr.detail.projectPersonel}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">报销分类</span>
                            <span class="long-detail">{{dataArr.detail.travelExpenseTypeListName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">随行人员</span>
                            <span class="long-detail">{{dataArr.detail.entourageListName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataArr.detail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group v-for="(el,idx) in dataArr.flowDetailList" :key="idx" title='出差申请明细' label-margin-right="1em">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">发生日期</span>
                            <span class="long-detail">{{el.startDate|stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">起点</span>
                            <span class="long-detail">{{el.startPointName.join(' ')}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">结束日期</span>
                            <span class="long-detail">{{el.endDate|stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">终点</span>
                            <span class="long-detail">{{el.endPointName.join(' ')}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">一级科目</span>
                            <span class="long-detail">{{el.firstSubName}}</span>
                        </div>
                        <div v-if="el.secondSubName" class="long-content">
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
                            <span class="detail-title long-title">预算金额</span>
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
        <group title="预览汇总" v-if="dataArr.flowDetailList.length != 0">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">总额</span>
                            <span class="long-detail">{{dataArr.detail.budgetTotal|thousands(2)}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">大写金额</span>
                            <span class="long-detail">{{dataArr.detail.budgetTotal|bigMoney}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title="审批流程" v-if="dataArr.detail.recpStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in dataArr.flowLoglist" :key="index">
                    <div :class="['ml-10',index==dataArr.flowLoglist.length-1?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            <!-- 审批bug的补丁 -->
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
            <template v-if="type === 'myself'">
                <!-- 审批草稿 -->
                <flexbox>
                    <!-- <flexbox-item v-if="dataArr.detail.expenseStatus == 4">
                        <x-button type="primary" @click.native="apply">提交</x-button>
                    </flexbox-item> -->
                    <!-- 审批草稿和审批被拒绝 -->
                    <flexbox-item v-if="dataArr.detail.isDeit == 1">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <!-- 已完结和已删除的不能删除 -->
                    <flexbox-item v-if="(dataArr.detail.recpStatus != 1) && (dataArr.detail.recpStatus != 0)">
                        <x-button type="default" :disabled="disDel" @click.native="del">删除</x-button>
                    </flexbox-item>
                    <!-- 审批中可以撤销 -->
                    <flexbox-item v-if="dataArr.detail.recpStatus == 2&&!ISEDIT">
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- todo 待我审批进入 -->
            <template v-if="type === 'todo'">
                <flexbox v-if="dataArr.detail.recpStatus == 2">
                    <flexbox-item  v-if="dataArr.detail.isDeit != 1">
                        <x-button type="primary" :disabled="disAgree" @click.native="agreeApply">同意</x-button>
                    </flexbox-item>
                    <flexbox-item  v-if="dataArr.detail.isDeit != 1">
                        <x-button type="warn" :disabled="disRefuse" @click.native="refuseApply">拒绝</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="dataArr.detail.isDeit == 1">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- done 我已审批进入 -->
            <template v-if="type === 'done'">
                <flexbox v-if="dataArr.detail.recpStatus == 2">
                    <flexbox-item>
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
        </box>
        <div v-transfer-dom>
            <x-dialog v-model="remarkForm.isRemarks" hide-on-blur @on-hide="cancelRemark">
                <div class="weui-dialog__hd">
                    <strong class="weui-dialog__title">审批意见</strong>
                </div>
                <group class="xdialog-group-textarea">
                    <x-textarea v-model="remarkForm.remarks" placeholder="请输入审批意见" :max="600" :rows="3"></x-textarea>
                </group>
                <div>
                    <div class="weui-dialog__ft">
                        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="cancelRemark">取消</a>
                        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="confirmRemark">确定</a>
                    </div>
                </div>
            </x-dialog>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import XHR from '@/assets/js/XHR';
import { Box, Confirm, Group, XButton, Timeline, Selector, TimelineItem, Cell,ConfirmPlugin, CellBox, XTextarea, XInput, XDialog, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "TripDetail",
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
    },
    data() {
        return {
            isReady: false,
            type: '',
            remarkForm: {
                isRemarks: false,
                remarks: '',
                flag: 'yes'//yes同意 no拒绝
            },
            receptionistVal: "",
            dataArr: {},
            optMap2: ['key', 'value'],
            approvalType:[{key: '1', value: '常规报销'}, {key: '2', value: '接待报销'}],
            disDel: false,
            disCancel: false,
            disRefuse: false,
            disAgree: false,
        }
    },
    computed:{
        ISEDIT:function(){
            let result = this.dataArr.detail.modify == 'modify' ? true :false;
            return result
        },
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
                    com.covertHttp(api.retravelFlowDetail,{
                        travelFlowId: params.id
                    }).then(rtn => {
                        if (rtn.status != 0) {
                            // this.$vux.toast.text(rtn.message) || "查询不到当前信息";
                            this.$router.push({ path: '/userIndex' });
                            return;
                        }
                        this.dataArr.detail = rtn.data.travelFlowresponse;
                        this.dataArr.flowDetailList = rtn.data.budgetDetailList || [];
                        this.dataArr.flowLoglist = rtn.data.flowLoglist || [];
                        if(this.dataArr.detail.travelExpenseTypeListName){
                            this.dataArr.detail.travelExpenseTypeListName = this.dataArr.detail.travelExpenseTypeListName.join(', ');
                        }
                        if(this.dataArr.detail.entourageListName){
                            this.dataArr.detail.entourageListName = this.dataArr.detail.entourageListName.join(', ');
                        }
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
            this.remarkForm.isRemarks = true;
            this.remarkForm.remarks = '';
            this.remarkForm.type = 'no';
            this.disRefuse = true;
        },
        agreeApply() {// 同意
            this.remarkForm.isRemarks = true;
            this.remarkForm.remarks = '';
            this.remarkForm.type = 'yes';
            this.disAgree = true;
        },
        cancelRemark(){
            this.remarkForm.isRemarks = false;
            this.disRefuse = false;
            this.disAgree = false;
        },
        confirmRemark() {
            var _this = this;
            if (this.remarkForm.type === 'no') {
                if (!this.remarkForm.remarks) {
                    this.$vux.toast.text('请输入审批意见');
                    return;
                }
            }
            com.covertHttp(api.travelFlowCompleteTask,{
                flag: this.remarkForm.type,
                comment: this.remarkForm.remarks,
                procInsId: this.dataArr.detail.procInsId || "",//同意或拒绝操作 从详情中取实例id
                travelFlowId: this.dataArr.detail.id
            }).then(rtn => {
                if (rtn.status == 0) {
                    // this.$vux.toast.text(rtn.message || "申请发起成功");
                    _this.$vux.toast.text(rtn.message || '操作成功');
                    _this.$router.go(-1);
                    com.delKeepAlive(_this,["TaskOption","UserIndex","TripListRecived","TripListSend"])
                    _this.disRefuse = false;
                    _this.disAgree = false;
                } else {
                    // _this.$vux.toast.text(rtn.message || '服务器异常');
                    _this.disRefuse = false;
                    _this.disAgree = false;
                    return;
                }
            })
        },
        editApply() {// 编辑
            this.$router.push({
                path: '/trip/form/' + this.$route.params.id
            });
            // com.delKeepAlive(this,["TripForm"])
        },
        apply() { // 提交申请
            com.covertHttp(api.startWorkFlow,{
                expenseFlowId: this.$route.params.id
            }).then(res => {
                this.$router.go(-1);
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
                    com.covertHttp(api.travelFlowRepealApply,{ travelFlowId: _this.$route.params.id }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","TripListRecived","TripListSend"])
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
                    com.covertHttp(api.travelFlowRepealTask,{
                        procInsId:_this.dataArr.detail.procInsId,
                        taskId:_this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","TripListRecived","TripListSend"])
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
        showImgFn(prefix,url) {
            if(url == "undefined" || url == "" || url == "null") {
                this.$vux.toast.text('获取图片失败');
                return false;
            }
            sdk.components.previewImage({ // 图片预览
                url: prefix + url,
                success:function(data) {
                    console.log(data);
                },
                fail(data) {
                    console.log(data)
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
