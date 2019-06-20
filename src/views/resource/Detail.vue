<template>
    <div>
        <group title='资源申请详情'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">流程编号</span>
                            <span class="long-detail font-orange">{{dataDetail.procCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">申请人员</span>
                            <span class="long-detail">{{dataDetail.applyPerName}}</span>
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
                            <span class="detail-title long-title">资源类型</span>
                            <span class="long-detail">{{dataDetail.resourcesTypeValue}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求数量</span>
                            <span class="long-detail">{{dataDetail.demandPersonelNum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">期望抵达时间</span>
                            <span class="long-detail">{{dataDetail.expectDate|stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计时长</span>
                            <span class="long-detail">{{dataDetail.timeLong}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预算总额</span>
                            <span class="long-detail">{{dataDetail.amountSum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataDetail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group v-for="(el,idx) in dataList" :key="idx" title='指派明细' label-margin-right="1em" v-if="dataList.length != 0">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">发起人</span>
                            <span class="long-detail">{{el.sourceAssignName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">指派对象</span>
                            <span class="long-detail">{{el.targetAssignName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">满足数量</span>
                            <span class="long-detail">{{el.personelNum}}</span>
                        </div>
                        <div v-if="el.secondSubName" class="long-content">
                            <span class="detail-title long-title">更新时间</span>
                            <span class="long-detail">{{el.updateTime}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{el.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
          
        <group v-if="type == 'todo' && dataDetail.resourcesStatus == 2 && dataDetail.isDeit != 1" 
            title="指派人员" v-for="(item, index) in assignStaff" :key="index">
            <AssignItem :index="index" :item="item" :memberList="memberList"></AssignItem>
            <!-- <group label-width="7em" label-margin-right="1em" label-align="justify" >
                <box gap="10px 15px">
                    <div style="height:26px">
                        <span class="fr font-orange" @click="openDelDialog(index)">删除</span>
                    </div>
                </box>
                <sinSelector sTitle='对象' sPlaceholder='请输入' :dataList="memberList" :sendData="item.targetAssign" :selectedItem.sync="item.targetAssign"></sinSelector>
                <x-input title="满足数量" placeholder="请输入" v-model="item.personelNum"></x-input>
                <x-textarea title="意见" placeholder="请输入" v-model.trim="item.remarks" :autosize="true" :max="500"></x-textarea>
            </group>
            <div v-transfer-dom>
                <confirm v-model="showDelDialog" title="删除该指派人" @on-cancel="showDelDialog = false" @on-confirm="delItem">
                    <p style="text-align:center;">{{ ('确定是否删除该指派人?') }}</p>
                </confirm>
            </div> -->
        </group>
        <div class="add-btn" v-if="type == 'todo' && dataDetail.resourcesStatus == 2 && dataDetail.isDeit != 1">
            <span class="pointer" @click="addItem">新增指派人</span>
        </div>
        
        
        <group title="审批流程" v-if="dataDetail.resourcesStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in flowLoglist" :key="index">
                    <div :class="['ml-10',index==flowLoglist.length-1?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            
                            <span v-if="index==0">{{el.activityName}}</span>
                            <span v-else-if="dataDetail.resourcesStatus==0 && index==flowLoglist.length - 1">{{el.activityName}}</span>
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
                    <flexbox-item v-if="dataDetail.isDeit == 1">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <!-- 已完结和已删除的不能删除 -->
                    <flexbox-item v-if="(dataDetail.resourcesStatus != 1) && (dataDetail.resourcesStatus != 0)">
                        <x-button type="default" :disabled="disDel" @click.native="del">删除</x-button>
                    </flexbox-item>
                    <!-- 审批中可以撤销 -->
                    <flexbox-item v-if="dataDetail.resourcesStatus == 2">
                        <x-button type="default" :disabled="disCancel" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- todo 待我审批进入 -->
            <template v-if="type === 'todo'">
                <flexbox v-if="dataDetail.resourcesStatus == 2">
                    <flexbox-item v-if="dataDetail.isDeit != 1">
                        <x-button type="primary" :disabled="disAgree" @click.native="submit('yes')">同意</x-button>
                    </flexbox-item>
                    <!-- <flexbox-item v-if="dataDetail.isDeit != 1">
                        <x-button type="warn" @click.native="submit('no')">拒绝</x-button>
                    </flexbox-item> -->
                    <flexbox-item v-if="dataDetail.isDeit == 1">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <!-- done 我已审批进入 -->
            <template v-if="type === 'done'">
                <flexbox v-if="dataDetail.resourcesStatus == 2">
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
import AssignItem from '@/components/AssignItem'
import sinSelector from "@/components/sinSelector";
import { Tab, Confirm, TabItem, Group, Selector, Cell, CellBox, Icon, Timeline, ConfirmPlugin, TimelineItem, XInput, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist, XAddress, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "ResourceDetail",
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
        sinSelector,
        AssignItem,
        Popup,
        Box,
        Checklist, 
    },
    data() {
        return {
            billType: 6,//1:市场,2:实施,3:报销 ,
            dataDetail: {},
            assignList: {
                personelNum:'',
                targetAssign:'',
                remarks:''
            },
            memberList:[],
            showDelDialog:false,
            delDialigIndex:"",
            dataList: [],
            // preBillNum: 0,
            flowLoglist: [],
            type: this.$route.params.type,
            disDel: false,
            disCancel: false,
            disRefuse: false,
            disAgree: false,
        }
    },
    computed: {
        ...mapState({
            assignStaff: state => state.assignStaff
        }),
    },
    created() {
        this.$store.dispatch('clearAssignStaff')
        this.init()

        //获取指派人员的列表
        com.covertHttp(api.queryResourcesApplyEmployeeList).then(res => {
            res.data.forEach(item => {
                this.memberList.push({
                    ...item,
                    value: item.name,
                    key: item.id,
                })
            });
        })
    },
    methods: {
        init() {
            var _this = this;
            var params = this.$route.params;
            this.addItem()
            if (params.id) {
                if (params.type && (params.type === 'todo' || params.type === 'done' || params.type === 'myself')) {
                    this.type = params.type;
                    com.covertHttp(api.resourcesApplyFlowDetail,{
                        resApplyFlowId: params.id,
                        // billType: this.billType,
                        // taskId:this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status != 0) {
                            // this.$vux.toast.text(rtn.message || "查询不到当前信息");
                            this.$router.push({ path: '/userIndex' });
                            return;
                        }
                        this.dataDetail = rtn.data.resourcesApplyFlowResponse;
                        this.dataList = rtn.data.resourcesApplyFlowResponse.assignList || [];
                        this.flowLoglist = rtn.data.flowLoglist || [];
                    }); 
                } else {
                    this.$router.push({ path: '/userIndex' });
                }

            } else {
                this.$router.push({ path: '/userIndex' });
            }
        },
        addItem() {
            var obj = com.clone(this.assignList);
            this.$store.dispatch("addAssignStaff", obj);
        },
        openDelDialog(index){
            this.showDelDialog = true;
            this.delDialigIndex = index;
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
                    com.covertHttp(api.deleteResourcesApplyFlow,{ resApplyFlowId: _this.$route.params.id }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '删除单据成功');
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ResourceListRecived","ResourceListSend"])
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
            //taskId
            var _this = this;
            this.disCancel = true;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定撤销？',
                onCancel () {
                    _this.disCancel = false;
                },
                onConfirm () {
                    com.covertHttp(api.resourcesApplyFlowRepealTask,{
                        procInsId:_this.dataDetail.procInsId,
                        taskId:_this.$route.params.taskId
                    }).then(rtn => {
                        if (rtn.status == 0) {
                            _this.$vux.toast.text(rtn.message || '流程收回成功');
                            _this.$router.go(-1);
                            com.delKeepAlive(_this,["TaskOption","UserIndex","ResourceListRecived","ResourceListSend"])
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
                path: '/resource/apply/' + this.$route.params.id
            });
            // com.delKeepAlive(this,["ResourceApply"])
        },
        apply() {//提交草稿
            var _this = this
            com.covertHttp(api.recpFlowStartWorkFlow,{ expenseFlowId: this.$route.params.id }).then(rtn => {
                if (rtn.status == 0) {
                    _this.$vux.toast.text(rtn.message || '申请发起成功');
                    _this.$router.go(-1);
                    com.delKeepAlive(_this,["TaskOption","UserIndex","ResourceListRecived","ResourceListSend"])
                } else {
                    // _this.$vux.toast.text(rtn.message || '服务器异常');
                    return;
                }
            });
        },
        submit(type) { // 同意
            if(this.vali(this)){
                this.disAgree = true;
                var _this = this;
                this.$vux.confirm.show({
                // 组件除show外的属性
                    title:'确定提交资源申请？',
                    onCancel () {
                        _this.disAgree = false;
                    },
                    onConfirm () {
                        com.covertHttp(api.resourcesApplyCompleteTask,{
                            procInsId:_this.dataDetail.procInsId,
                            // taskId :_this.$route.params.taskId,
                            resApplyFlowId:_this.$route.params.id,
                            assignList:_this.assignStaff,
                            flag:type,
                        }).then(rtn => {
                            if(rtn.status == 0) {
                                _this.$vux.toast.text(rtn.message || '审批成功');
                                _this.$router.go(-1);
                                com.delKeepAlive(_this,["TaskOption","UserIndex","ResourceListRecived","ResourceListSend"])
                                _this.disAgree = false;
                            } else {
                                // this.$vux.toast.text(rtn.message || '服务器异常');
                                _this.disAgree = false;
                                return;
                            }
                        });
                    }
                })
            }
        },
        vali(self){
            var flag = true;
            if(self.assignStaff<1){
                self.$vux.toast.text('添加指派意见！');
                flag = false;
            }
            else if(!itemVali()){
                flag = false
            }
            else if(!targetVali()){
                flag = false
            }
            function targetVali(){
                for(let i =0;i<self.assignStaff.length;i++){
                    for(let j = 0;j<self.assignStaff.length;j++){
                        if(self.assignStaff[i].targetAssign == self.assignStaff[j].targetAssign && i!=j){
                            self.$vux.toast.text('不得重复指派！');
                            flag = false;
                            return;
                        }
                    }
                }
                return flag
            }
            function itemVali(){
                self.assignStaff.forEach(item => {
                    if (!item.targetAssign) {
                        self.$vux.toast.text('请选择指派对象！');
                        flag = false;
                        return 
                    }
                    else if (!/(^[0-9]\d*$)/.test(item.personelNum) || item.personelNum == 0) {
                        self.$vux.toast.text('正确填写满足数量！');
                        flag = false;
                        return 
                    }else if(/(^[0-9]\d*$)/.test(item.personelNum)&&item.personelNum.length>5){
                        self.$vux.toast.text('满足数量超过限制！');
                        flag = false;
                        return 
                    }
                })
                return flag
            }
            return flag;
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

