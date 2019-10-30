<template>
    <div class="approval_apply">
        <group title='基本信息' label-margin-right="1em">
            <x-input title="申请人" readonly :value="baseInfo.userName"></x-input>
            <x-input title="所属部门" readonly :value="baseInfo.officeName"></x-input>
            <datetime format="YYYY-MM-DD" class="data-time" v-model="applyData.applyTime" title="申请日期" placeholder="请选择开始时间" readonly></datetime>
            <sinSelector sTitle='办理类型' :isRequired="true" sPlaceholder='请选择' @on-change="changeType" :dataList="dictionary.handleType" :sendData="applyData.handleType" :selectedItem.sync="applyData.handleType"></sinSelector>
            <x-input title="关联主题" v-if="applyData.handleType == '2'" :value="relationTheme" placeholder='请选择' @click.native="openTheme = true" readonly>
                <span slot="label" class="mr-10">关联主题<span class="required">*</span></span>
            </x-input>
            <x-input title="项目名称" v-if="applyData.handleType == '2'" :value="applyData.projectName" readonly></x-input>
            <proSelector sTitle='关联项目' :isRequired="true" v-if="applyData.handleType == '1'" sPlaceholder='请选择'  @on-change="changProject" :sendData="applyData.projectId" :selectedItem.sync="applyData.projectId" :sLabel="applyData.projectName"></proSelector>
            <x-input title="项目负责人" :value="applyData.projectPersonel" readonly></x-input>
            <datetime title="期望抵达时间" v-if="applyData.handleType == '1'" format="YYYY-MM-DD HH" class="data-time" v-model="applyData.expectDate" placeholder="请选择时间" :display-format="expectDateType"></datetime>
            <x-input title="期望抵达时间" v-else v-model="expectDate" readonly></x-input>
            <x-input title="预计时长" :max="50" v-if="applyData.handleType == '1'" placeholder='请输入' type="number" v-model.number="applyData.timeLong">
                <span slot="label" class="mr-10">预计时长<span class="required">*</span></span>
            </x-input>
            <x-input title="预算费用合计" :max="50" v-if="applyData.handleType == '1'" type="number" placeholder='请输入' v-model.number="applyData.amountSum">
                <span slot="label" class="mr-10">预算费用合计<span class="required">*</span></span>
            </x-input>
            <x-input title="预算费用合计" v-else type="number" v-model.number="applyData.amountSum" readonly></x-input>
            <sinSelector sTitle='资源类型' :isRequired="true" v-if="applyData.handleType == '1'" sPlaceholder='请选择' :dataList="dictionary.resourcesType" :sendData="applyData.resourcesType" :selectedItem.sync="applyData.resourcesType"></sinSelector>
            <x-input title="满足数量" v-if="applyData.handleType == '1'" :value="assignedStaff" readonly></x-input>
            <x-input title="满足数量" v-else :value="demandPersonelNum" readonly></x-input>
            <x-textarea title="备注" v-model="applyData.remarks" placeholder="请输入备注" :max="200" :rows="3"></x-textarea>
        </group>
        <group title='联系人信息' label-margin-right="1em" v-for="(item, index) in assignStaff" :key="index">
            <AssignItem :index="index" :item="item" :memberList="assignDataList"></AssignItem>
        </group>
        <div class="add-btn">
            <span class="pointer" @click="addItem">添加指派人员</span>
        </div>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" class="mt-15" :disabled="disSubmit" @click.native="submit">提交申请</x-button>
                </flexbox-item>
                <flexbox-item v-if="paramsId ==0 ||(paramsId !=0 && expenseStatus == 4)">
                    <x-button type="default" class="mt-15" :disabled="disDraft" @click.native="draft">存为草稿</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <div v-transfer-dom>
            <confirm v-model="isSubmit" title="提交申请" @on-cancel="isSubmit=false" @on-confirm="submit(true)">
                <p style="text-align:center;">{{ ('确定执行操作?') }}</p>
            </confirm>
        </div>
        <!-- 关联主题 -->
        <div v-transfer-dom>
            <popup v-model="openTheme" height="100%">
                <div class="popup1">
                    <group v-if="relationThemeList.length!=0">
                        <cell-box v-for="(el,index) in relationThemeList" :key="index" @click.native="themeConfirm(index)">
                            <div class="w-100">
                                <div class="disc-text">
                                    <div class="long-content">
                                        <span class="disc-title long-title">流程编号</span>
                                        <span class="long-text">{{el.procCode}}</span>
                                    </div>
                                    <div class="long-content">
                                        <span class="disc-title long-title">关联主题</span>
                                        <span class="long-text">{{el.procName}}</span>
                                    </div>
                                    <div class="long-content">
                                        <span class="disc-title long-title">申请人</span>
                                        <span class="long-text">{{el.applyPerName}}</span>
                                    </div>
                                    <div class="long-content">
                                        <span class="disc-title long-title">费用合集</span>
                                        <span class="long-text font-orange">{{el.amountSum}}</span>
                                    </div>

                                </div>
                            </div>
                        </cell-box>
                    </group>
                    <div class="add-btn mb-15" v-if="loadThemeMore">
                        <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
                    </div>
                    <div class="pointout" v-if="relationThemeList.length==0">
                        <icon type="info" is-msg class="pointout-icon"></icon>
                        <div class="mt-10">暂无数据</div>
                    </div>
                </div>
            </popup>
            <box class="checklistbtn" v-if="openTheme">
                <flexbox>
                    <flexbox-item>
                        <x-button type="primary" @click.native="openTheme = false">取消</x-button>
                    </flexbox-item>
                </flexbox>
            </box>
        </div>
    </div>
</template>
<script>
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import { mapState, mapGetters } from 'vuex'
import sinSelector from "@/components/sinSelector";
import AssignItem from '@/components/AssignItem';
import proSelector from '@/components/proSelector';
import XHR from "@/assets/js/XHR";
import {
    XAddress,
    Box,
    Popup,
    Checklist,
    Search,
    Group,
    Cell,
    XDialog,
    CellBox,
    Icon,
    XButton,
    PopupPicker,
    XInput,
    XTextarea,
    Selector,
    Confirm,
    Calendar,
    Datetime,
    Flexbox,
    FlexboxItem,
    TransferDomDirective as TransferDom
} from "vux";
export default {
    name: "ResHandleApply",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Group,
        Cell,
        CellBox,
        XButton,
        Popup,
        PopupPicker,
        Checklist,
        Datetime,
        Search,
        XInput,
        XTextarea,
        Selector,
        Confirm,
        Icon,
        Calendar,
        Flexbox,
        FlexboxItem,
        XAddress,
        XDialog,
        sinSelector,
        AssignItem,
        proSelector,
    },

    data: function() {
        return {
            isSubmit: false,
            paramsId: this.$route.params.id,
            expenseStatus: "",
            projectNameOpt: [],
            openTheme: false,
            relationTheme: "",
            relationThemeList: [],
            assignDataList:[],
            expectDate:"",
            assignList:{
                personelNum: "",//满足人数
                remarks: "",//备注
                targetAssign: "",//被指派者人员ID
            },
            demandPersonelNum:"",
            applyData: {
                amountSum: "",//预算金额
                applyPerCode: "",//申请人编号
                applyPerName: "",//申请人名称
                projectName:"",//项目名称
                projectPersonel: "",//项目负责人
                applyTime: com.timeFormat(new Date().getTime()), // 申请时间
                assignList: [//指派人员
                    {
                        personelNum: "",//满足人数
                        remarks: "",//备注
                        targetAssign: ""//被指派者人员ID
                    }
                ],
                expectDate: com.timeFormatHour(new Date().getTime()),//期望抵达日期
                handleType: "2",// 办理类型(主动发起/被动发起)
                id: "",
                personelNum: 0,//满足人数
                procCode: "",//流程编号
                procInsId: "",//流程实例ID
                procName: "",//流程名称
                projectId: "",// 项目ID
                relationTheme: "",//关联主题
                remarks: "",//备注
                resourcesType: "",//资源类型
                timeLong: ""//预计时长
            },
            baseInfo: {
                userName: ""
            },
            dictionary: {
                resourcesType: [],
                handleType:[],
            },
            theme:{
                pageNo: 1, //当前页数,
                pageTotal: 1,
                pageSize: 10, //固定常量
                count:-1,
            },
            disDraft: false,
            disSubmit: false,
        };
    },
    computed: {
        ...mapState({
            assignStaff: state => state.assignStaff
        }),
        ...mapGetters(["assignedStaff"]),
        loadThemeMore() {
            if (this.theme.pageNo >= this.theme.pageTotal) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {
        this.$store.dispatch('clearAssignStaff')
        this.init();
        this.getThemeList();
        this.getDictionary();
        this.getDict();
        this.getAppointList()
        // com.addKeepAlive(this) //添加keep-alive
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        getDictionary() {
            // com.covertHttp(api.queryDict).then(res => {
            //     var getData = res.data;
            com.comGetStorage('queryDict').then(data => {
                var getData = data.dict
                getData.forEach((item, index) => {
                    getData[index] = {
                        ...item,
                        key: item.value,
                        value: item.name,
                    }
                })
                function selectDic(arr, type) {
                    let temp = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].type == type) {
                            temp.push(arr[i]);
                        }
                    }
                    return temp;
                }
                this.dictionary.resourcesType = selectDic(getData, "resources_type");//资源类型
                this.dictionary.handleType = selectDic(getData, "handle_type");//办理类型
            });
        },
        getThemeList(){
            //获取关联主题
            com.covertHttp(api.queryRelationResourcesApplyFlowList,{
                pageNo:this.theme.pageNo,
                pageSize:this.theme.pageSize,
                }).then(res => {
                this.relationThemeList = res.data.list || [];
                this.theme.count = parseInt(res.data.total) || 0;
                this.theme.pageTotal = Math.ceil(this.theme.count / this.theme.pageSize);

            });
        },
        clickLoadMore(){
            this.theme.pageNo = this.theme.pageNo + 1;
            com.covertHttp(api.queryRelationResourcesApplyFlowList,{
                pageNo:this.theme.pageNo,
                pageSize:this.theme.pageSize,
                }).then(res => {
                this.relationThemeList.push(...res.data.list);
                this.theme.count = parseInt(res.data.total) || 0;
                this.theme.pageTotal = Math.ceil(this.theme.count / this.theme.pageSize);

            });
        },
        init() {
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = res;
            });
            if (this.$route.params.id == 0) {
                // 新增
                this.addItem()
            } else {
                // 编辑
                // 处理编辑逻辑
                this.applyData.id = this.$route.params.id;
                this.getDetail().then(rtnData => {
                    // 基础参数赋值
                    var rData = rtnData.resourcesHandleFlowResponse
                    this.applyData = rData
                    if(rData.handleType == 2){
                        this.relationTheme = rData.relationThemeName;
                        this.demandPersonelNum = rData.personelNum;
                        this.expectDate = com.formatFullDateTime(rData.expectDate)
                        this.applyData.expectDate = com.timeFormatHour(new Date().getTime())
                    }
                    if(rData.handleType == 1){
                        this.applyData.expectDate = com.timeFormatHour(rData.expectDate)
                    }
                    // if(rData.resourcesAssignResponseList) this.$store.dispatch("fillAssignStaff", rData.resourcesAssignResponseList);
                    if(rData.resourcesAssignResponseList){
                        this.getAssignList(rData.resourcesAssignResponseList)
                    } else {
                        this.addItem()
                    }
                    if(this.assignStaff.length == 0) this.addItem()

                });
            }
        },
        getDetail() {
            return new Promise((resolve, reject) => {
                com.covertHttp(api.resourcesHandleInfoDetail, {
                        resHandleFlowId: this.$route.params.id
                    })
                    .then(rtn => {
                        resolve(rtn.data);
                    });
            });
        },
        addItem() {
            var obj = com.clone(this.assignList);
            this.$store.dispatch("addAssignStaff", obj);
        },
        submit() {
            var _this = this
            var AssignData = this.validAssign();
            if (!this.valid()) return; //校验
            if(!AssignData.flag) return;
            var postData = {
                ...this.applyData,
                applyTime: com.timeParse(this.applyData.applyTime),
                assignList:AssignData.afterFilterEmptyArr,
                expectDate:com.timeParse(this.applyData.expectDate+":00:00"),
            };
            this.disSubmit = true;
            this.$vux.confirm.show({
                title: "提交申请",
                content: "确定执行操作？",
                onCancel() {
                    _this.disSubmit = false;
                },
                onConfirm() {
                    _this.handleApply(postData);
                }
            });
        },
        handleApply(postData) {
            com.covertHttp(api.resourcesHandleApply, {
                ...postData
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.$router.push({ path: "/userIndex" });
                    com.delKeepAlive(this,["TaskOption","UserIndex","ResHandleListRecived","ResHandleListSend"])
                } else {
                    // this.$vux.toast.text(
                    //     rtn.message || "提交失败，请注意是否填写有误"
                    // );
                }
                _this.disSubmit = false;
            });
        },
        draft(){
            var AssignData = this.validAssign();
            if (!this.valid()) return;
            if(!AssignData.flag) return;
            this.disDraft = true;
            var postData = {
                ...this.applyData,
                applyTime: com.timeParse(this.applyData.applyTime),
                assignList:AssignData.afterFilterEmptyArr,
                expectDate:com.timeParse(this.applyData.expectDate+":00:00"),
            };
            var id = this.$route.params.id == 0 ? "" : this.$route.params.id;
            com.covertHttp(api.saveResourcesHandleInfo, {
                ...postData,
                id: id
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.$vux.toast.text(rtn.message || "申请发起成功");
                    this.$router.push({ path: "/userIndex" });
                    com.delKeepAlive(this,["TaskOption","UserIndex","ResHandleListRecived","ResHandleListSend"])
                } else {
                    // this.$vux.toast.text(
                    //     rtn.message || "提交失败，请注意是否填写有误"
                    // );
                }
                this.disDraft = false;
            });
        },
        valid() {
            // 整体校验
            var flag = true, _this = this;
            if (this.applyData.handleType == "") {
                this.$vux.toast.text("请选择办理类型");
                return flag = false;
            }
            if(this.applyData.handleType == 2){//被动发起
                if (this.applyData.relationTheme == "") {
                    this.$vux.toast.text("请关联主题");
                    return flag = false;
                }
            }
            if(this.applyData.handleType == 1){//主动发起
                if (this.applyData.projectId == "") {
                    this.$vux.toast.text("请选择项目");
                    return flag = false;
                }
                if (this.applyData.timeLong == "") {
                    this.$vux.toast.text("请填写预计时长");
                    return flag = false;
                }
                if (this.applyData.amountSum == "") {
                    this.$vux.toast.text("请填费用合计");
                    return flag = false;
                }
                if (this.applyData.resourcesType == "") {
                    this.$vux.toast.text("请选择资源类型");
                    return flag = false;
                }
            }

            return flag
        },
        validAssign(){
            var flag = true;
            if(this.assignStaff.length == 0){
                this.$vux.toast.text("请添加指派信息");
                return flag = false;
            }
            var afterFilterEmptyArr = this.assignStaff.filter((el, idx, array) => {
                if (el.targetAssign || el.personelNum || el.remarks) {
                    return true;
                }
            })
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
            return {flag,afterFilterEmptyArr}
        },
        getDict(type) {
            com.covertHttp(api.queryDictInfo, {
                    dictType:"oa_project"
                })
                .then(rtn => {
                    // this.projectNameOpt = rtn.data;
                    rtn.data.forEach((item, index) => {
                        this.projectNameOpt.push({
                            ...item,
                            value: item.label,
                            key: item.value
                        });
                    });
                });
        },
        changProject(el){
          // console.log(el);
          this.applyData.projectPersonel = el.projectLeaderName
            // this.projectNameOpt.forEach((item,index)=>{
            //     if(item.key == this.applyData.projectId){
            //         this.applyData.projectPersonel = item.projectLeaderName
            //     }
            // })
        },
        getAssignList(data){
            data.forEach((item,idx)=>{
                if(item.sourceAssign == this.baseInfo.userId){
                    this.$store.dispatch("addAssignStaff", {
                        personelNum:item.personelNum,
                        remarks:item.remarks,
                        targetAssign:item.targetAssign,
                        targetAssignName:item.targetAssignName,
                    });

                }
            })
        },
        themeConfirm(idx) {
            this.applyData.projectId = this.relationThemeList[idx].projectId;
            this.applyData.relationTheme = this.relationThemeList[idx].procCode;
            this.relationTheme = this.relationThemeList[idx].procName;
            this.applyData.projectName = this.relationThemeList[idx].projectName;
            this.applyData.projectPersonel = this.relationThemeList[idx].projectPersonel;
            this.openTheme = false;
            this.demandPersonelNum = this.relationThemeList[idx].demandPersonelNum;
            this.applyData.amountSum = this.relationThemeList[idx].amountSum
            this.expectDate = this.relationThemeList[idx].expectDate
        },
        changeType(){
            this.applyData.projectId = "";
            this.applyData.relationTheme = "";
            this.relationTheme = "";
            this.applyData.projectName = "";
            this.applyData.projectPersonel = "";
            this.demandPersonelNum = "";
            this.applyData.amountSum = "";
            this.expectDate = "";
            this.applyData.timeLong = "";
            this.applyData.resourcesType = "";
        },
        getAppointList(){
            com.covertHttp(api.queryHandleEmployeeList).then(res => {
                var getData = res.data || [] ,_this = this;
                getData.forEach(function (item, index) {
                    _this.assignDataList.push({
                        ...item,
                        value: item.name,
                        key: item.id,
                    })
                })
            });
        },
        expectDateType(val){
            return val + ":00:00"
        },

    }
};
</script>
<style scoped lang="less">
.approval_apply {
    .btnWrap {
        display: flex;
        div {
            flex: 1;
            margin: 0 4px;
        }
    }

    .dialog-demo {
        .weui-dialog {
            border-radius: 8px;
            padding-bottom: 8px;
        }
        .dialog-title {
            line-height: 30px;
            color: #666;
        }
        .img-box {
            height: 360px;
            width: 100%;
            overflow: hidden;
        }
        .vux-close {
            margin-top: 8px;
            margin-bottom: 8px;
        }
        .btn-bottom {
            position: fixed !important;
            bottom: 20px;
        }
    }
    .popup1 {
        padding-bottom: 62px;
    }
    .weui-cells {
        margin-top: 0 !important;
    }
    .vux-no-group-title {
        margin-top: 0 !important;
    }
    .search {
        /* width: 100%; */
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 10000;
        background: #eee;
    }
    .checkcontent {
        margin-top: 43px;
    }
}
.checklistbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10000;
    background: #eee;
}

.pointout .pointout-icon {
    padding-top: 150px;
    display: block;
    text-align: center;
    background: #eee;
    // border: 1px solid #eee;
    // .weui-cells:before{
    //     border:none;
    // }
}
.pointout div {
    background: #eee;
    padding-top: 20px;
    text-align: center;
    border: 1px solid #eee;
}
</style>

