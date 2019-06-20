<template>
    <div v-if="isReady">
        <group title='接待申请详情'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">申请人员</span>
                            <span class="long-detail font-orange">{{dataDetail.applyPerName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">申请时间</span>
                            <span class="long-detail">{{projectTime}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">接待主题</span>
                            <span class="long-detail">{{dataDetail.recpTheme}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目名称</span>
                            <span class="long-detail">{{dataDetail.projectName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">项目负责人</span>
                            <span class="long-detail">{{dataDetail.projectPersonel}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计接待人数</span>
                            <span class="long-detail">{{dataDetail.recpNum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计接待时间</span>
                            <span class="long-detail">{{rtime|stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计陪客人员</span>
                            <span class="long-detail">{{employeesName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataDetail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
       <group v-for="(el,idx) in dataList" :key="idx" title='预算明细' label-margin-right="1em">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">发生日期</span>
                            <span class="long-detail">{{el.startDate|stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">结束日期</span>
                            <span class="long-detail">{{el.endDate|stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">科目</span>
                            <span class="long-detail">{{el.subjectName}}</span>
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
        <group title="预览汇总" v-if="dataList.length != 0">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">总额</span>
                            <span class="long-detail">{{dataDetail.budgetTotal|thousands(2)}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">大写金额</span>
                            <span class="long-detail">{{dataDetail.budgetTotal|bigMoney}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>  
        <!-- <group class="examination" v-if="type == 'todo' && dataDetail.recpStatus == 2 && dataDetail.isDeit != 1" title="审批意见" label-margin-right="1em">
            <x-textarea v-model="remarkForm.remarks"  placeholder="请输入审批意见" :max="600" :rows="3"></x-textarea>
        </group> -->

        <div v-transfer-dom>
        <!-- <div v-transfer-dom  v-if="type == 'todo' && dataDetail.recpStatus == 2 && dataDetail.isDeit != 1"> -->
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
        <group title="审批流程" v-if="dataDetail.recpStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in flowLoglist" :key="index">
                    <div :class="['ml-10',index==flowLoglist.length-1?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            
                            <span v-if="index==0">{{el.activityName}}</span>
                            <span v-else-if="dataDetail.recpStatus==0 && index==flowLoglist.length - 1">{{el.activityName}}</span>
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
                    <!-- 审批草稿和审批被拒绝 -->
                    <flexbox-item v-if="ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <!-- 已完结和已删除的不能删除 -->
                    <flexbox-item v-if="(dataDetail.recpStatus != 1) && (dataDetail.recpStatus != 0)">
                        <x-button type="default" :disabled="disDel" @click.native="del">删除</x-button>
                    </flexbox-item>
                    <!-- 审批中可以撤销 -->
                    <flexbox-item v-if="ISCANCEL&&!ISEDIT">
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- todo 待我审批进入 -->
            <template v-if="type === 'todo'">
                <flexbox v-if="dataDetail.recpStatus == 2">
                    <flexbox-item v-if="dataDetail.isDeit != 1">
                        <x-button type="primary" :disabled="disAgree" @click.native="agreeApply">同意</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="dataDetail.isDeit != 1">
                        <x-button type="warn" :disabled="disRefuse" @click.native="refuseApply">拒绝</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="dataDetail.isDeit == 1">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- done 我已审批进入 -->
            <template v-if="type === 'done'">
                <flexbox v-if="dataDetail.recpStatus == 2">
                    <flexbox-item>
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
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

import { Tab, Confirm, TabItem, Group, Selector, Cell, CellBox, Icon, Timeline, ConfirmPlugin, TimelineItem, XInput, XDialog, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist, XAddress, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "ReceptionDetail",
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Group,
        Cell,
        Selector,
        Confirm,
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
        XDialog,
    },
    data() {
        return {
            billType: 4,//1:市场,2:实施,3:报销 ,
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
            rtime:"",
            projectTime: "",
            employeesName: "",
            baseInfo:"",
            disDel: false,
            disCancel: false,
            disRefuse: false,
            disAgree: false,
        }
    },
    computed: {
        ISME: function() {
            let result = this.baseInfo.userName == this.dataDetail.applyPerName ? true : false;
            return result;
        },
        ISDEL: function() {
            let result =this.dataDetail.recpStatus == 2 || this.dataDetail.recpStatus == 3 || this.dataDetail.recpStatus == 4 ? true : false;
            return result;
        },
        ISPUTIN: function() {
            let result = this.dataDetail.recpStatus == 4 ? true : false;
            return result;
        },
        ISPRINT: function() {
            let result = this.dataDetail.expenseStatus == 1 ? true : false;
            return result;
        },
        ISEDIT: function() {
            let result = this.dataDetail.modify == "modify" ? true : false;
            return result;
        },
        ISCANCEL: function() {
            let result = this.dataDetail.recpStatus == 2 ? true : false;
            return result;
        },
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            var _this = this;
            var params = this.$route.params;
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = res;
            });
            if (params.id) {
                if (params.type && (params.type === 'todo' || params.type === 'done' || params.type === 'myself')) {
                    this.type = params.type;
                    com.covertHttp(api.recpFlowDetail,{
                        recpFlowId: params.id
                    }).then(rtn => {
                        if (rtn.status != 0) {
                            // this.$vux.toast.text(rtn.message || "查询不到当前信息");
                            this.$router.push({ path: '/userIndex' });
                            return;
                        }
                        this.dataDetail = rtn.data.recpFlowresponse;
                        this.rtime = rtn.data.recpFlowresponse.recpTime || "";
                        this.projectTime = com.timeFormat(rtn.data.recpFlowresponse.applyTime);
                        this.dataList = rtn.data.budgetDetailList || [];
                        this.flowLoglist = rtn.data.flowLoglist;
                        this.dataList.forEach((item,index)=>{
                            item.subjectName = rtn.data.budgetDetailList[index].subjectName.join(' ')
                        })
                        if(rtn.data.recpFlowresponse.employeesName){
                            this.employeesName = this.dataDetail.employeesName.join(' ')
                        } else {
                            this.employeesName = ""
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
        del() { //删除
            var _this = this;
            this.disDel = true;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定删除？',
                onCancel () {
                    _this.disDel = false;
                },
                onConfirm () {
                    com.covertHttp(api.recpFlowRepealApply,{ recpFlowId: _this.$route.params.id }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '删除单据成功');
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ReceptionListRecived","ReceptionListSend"])
                            _this.disDel = false;
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            _this.disDel = false;
                            return;
                        }
                    }); 
                }
            })
        },
        cancel() { //撤销
            // procInsId: this.dataArr.detail.procInsId || ""
            // taskId
            var _this = this;
            this.disCancel = true;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定撤销？',
                onCancel () {
                    _this.disCancel = false;
                },
                onConfirm () {
                    com.covertHttp(api.recpFlowRepealTask,{
                        procInsId:_this.dataDetail.procInsId,
                        taskId:_this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '流程收回成功');
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ReceptionListRecived","ReceptionListSend"])
                            _this.disCancel = false;
                        } else {
                            // _this.$vux.toast.text(rtn.message || '服务器异常');
                            _this.disCancel = false;
                            return;
                        }
                    });
                }
            })
        },
        editApply() {
            this.$router.push({
                path: '/reception/Apply/' + this.$route.params.id
            });
            // com.delKeepAlive(this,["ReceptionApply"])
        },
        apply() {//提交草稿
            var _this = this
            com.covertHttp(api.recpFlowStartWorkFlow,{ recpFlowId: this.$route.params.id }).then(rtn => {
                if (rtn.status == 0) {
                    _this.$vux.toast.text(rtn.message || '申请发起成功');
                    this.$router.go(-1);
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                    return;
                }
            });
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
        confirmRemark() { // 同意
            if(this.remarkForm.type == 'no' && this.remarkForm.remarks == '') {
                this.$vux.toast.text("请输入审批意见");
                return;
            }
            var _this = this;
            com.covertHttp(api.recpFlowCompleteTask,{
                procInsId:_this.dataDetail.procInsId,
                comment:_this.remarkForm.remarks,
                recpFlowId:_this.dataDetail.id,
                flag: _this.remarkForm.type,
            }).then(rtn => {
                if(rtn.status == 0) {
                    _this.$vux.toast.text(rtn.message || '审批成功');
                    _this.$router.go(-1);
                    com.delKeepAlive(_this,["TaskOption","UserIndex","ReceptionListRecived","ReceptionListSend"])
                    _this.disRefuse = false;
                    _this.disAgree = false;
                }
            });
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

