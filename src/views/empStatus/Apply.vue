<template>
    <div class="approval_apply">
        <group title='实施状态标记' label-margin-right="1em">
            <sinSelector sTitle='人员动作' :isRequired="true" sPlaceholder='请选择' @on-change="changeType" :dataList="dictionary.employeeAction" :sendData="applyData.userAction" :selectedItem.sync="applyData.userAction"></sinSelector>
            <!-- <sinSelector v-if="!isBase" sTitle='项目名称' :isRequired="true" sPlaceholder='请选择' @on-change="changProject" :dataList="projectList" :sendData="applyData.projectId" :selectedItem.sync="applyData.projectId"></sinSelector> -->
            <proSelector v-if="!isBase" sTitle='项目名称' :isRequired="true" sPlaceholder='请选择' @on-change="changProject" :dataList="projectList" :sendData="applyData.projectId" :selectedItem.sync="applyData.projectId"></proSelector>
            <sinSelector v-if="!isBase" sTitle='地点节点' :isRequired="true" sPlaceholder='请选择' :dataList="projectNodeList" :sendData="applyData.projectNodeId" :selectedItem.sync="applyData.projectNodeId"></sinSelector>
            <sinSelector v-if="isBase" sTitle='待命基地' :isRequired="true" sPlaceholder='请选择' :dataList="dictionary.employeeBase" :sendData="applyData.baseId" :selectedItem.sync="applyData.baseId"></sinSelector>
            <x-textarea title="备注" v-model="applyData.remarks" placeholder="请输入" :max="200" :rows="3"></x-textarea>
        </group>
        <box class="fixbtn">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" :disabled="disSubmit" @click.native="submit">保存</x-button>
                </flexbox-item>
            </flexbox>
        </box>
    </div>
</template>
<script>
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import sinSelector from "@/components/sinSelector";
import proSelector from "@/components/proSelector";
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
    name: "EditApproval",
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
        proSelector,
    },

    data: function() {
        return {
            applyData: {
                baseId: "",//待命基地
                projectId: "",//项目名称
                projectNodeId: "",//地点节点
                remarks: "",//备注
                userAction: ""//人员动作
            },
            projectList: [], // 项目list数组
            projectNodeList:[],
            beforeState:this.$route.params.type,
            oldUserAction:false,
            dictionary: {
                employeeAction: [],
                employeeBase: [],
            },
            disSubmit: false,
        };
    },
    computed: {
        isBase(){
            if (this.applyData.userAction == 4||this.applyData.userAction == 5) {
                return true;
            } else {
                return false;
            }
        },
    },
    created() {
        this.getDictionary();
        this.init();
        // this.getProject(); // 项目列表
    },
    methods: {
        getProject() {
            com.covertHttp(api.queryDictInfo, {
                    dictType: "oa_project"
                })
                .then(rtn => {
                    rtn.data.forEach((item, index) => {
                        this.projectList.push({
                            ...item,
                            value: item.label,
                            key: item.value
                        });
                    });
                });
        },
        getDictionary() {
            com.comGetStorage("queryDict").then(data => {
                var getData = data.dict;
                getData.forEach((item, index) => {
                    getData[index] = {
                        ...item,
                        key: item.value,
                        value: item.name
                    };
                });
                function selectDic(arr, type) {
                    let temp = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].type == type) {
                            temp.push(arr[i]);
                        }
                    }
                    return temp;
                }
                this.dictionary.employeeAction = selectDic(getData, "oa_employee_action"); //人员动作
                this.dictionary.employeeBase = selectDic(getData, "oa_employee_base");//待命基地
                this.delActDict()
            });
        },
        delActDict(){
            if(this.beforeState == 0){//没填写过状态
                this.delDict([2,5])
            } else if(this.beforeState == 1){//出发(上项目)
                this.delDict([1,5])
            } else if(this.beforeState == 2){//到达项目
                this.delDict([1,2,5])
            } else if(this.beforeState == 3||this.beforeState == 5){//撤离（原地待命）或到达基地
                this.delDict([2,3,5])
            } else if(this.beforeState == 4){//撤离（去基地待命）
                this.delDict([2,3])
            }
        },
        delDict(list){ 
            var arrBox = com.clone(this.dictionary.employeeAction)
            for(var i=arrBox.length-1;i>=0;i--){
                for(let idx in list){
                    if(arrBox[i].key == list[idx]){
                        arrBox.splice(i,1)
                        break
                    }
                }
            }
            this.dictionary.employeeAction = arrBox
        },
        getProjectNode(){
            this.projectNodeList = [];
            var _this = this;
            com.covertHttp(api.findProjectNode,{
                projectId: this.applyData.projectId
            }).then(rtn => {
                var data = rtn.data || []
                data.forEach(function(item, index) {
                    _this.projectNodeList.push({
                        ...item,
                        value: item.nodeName,
                        key: item.nodeId
                    });
                });
            });
        },
        changProject(){
            this.applyData.projectNodeId = "";
            this.getProjectNode()
        },
        changeType() {
            if(this.isBase != this.oldUserAction){
                this.clean()
                if (this.applyData.userAction == 4||this.applyData.userAction == 5) {
                    this.oldUserAction = true;
                } else {
                    this.oldUserAction = false;
                }
            }
        },
        clean(){
            this.applyData.projectId = "";
            this.projectNodeList = [];
            this.applyData.projectNodeId = "";
            this.applyData.baseId = "";
        },

        init() {
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = Object.assign({}, this.baseInfo, res);
            });
        },
        valid() {
            // 整体校验
            var flag = true;
            if (this.applyData.userAction == "") {
                this.$vux.toast.text("请选择人员动作");
                return flag = false;
            }
            if (this.isBase) {
                if (this.applyData.baseId == "") {
                    this.$vux.toast.text("请选择待命基地");
                    return flag = false;
                }
            } else {
                if (this.applyData.projectId == "") {
                    this.$vux.toast.text("请选择项目名称");
                    return flag = false;
                }
                if (this.applyData.projectNodeId == "") {
                    this.$vux.toast.text("请选择地点节点");
                    return flag = false;
                }
            }
            return flag
        },
        submit() {
            var _this = this
            if (!this.valid()) return;
            this.disSubmit = true;
            this.$vux.confirm.show({
                title: "是否保存",
                content: "确定执行操作？",
                onCancel() {
                    _this.disSubmit = false;
                },
                onConfirm() {
                    _this.goConfirm();
                }
            });    
        },
        goConfirm(){
            com.covertHttp(api.saveEmployeeStatus,this.applyData).then(rtn => {
                if (rtn.status == 0) {
                    this.$router.go(-1);
                    this.$vux.toast.text(rtn.message || "保存状态成功!");
                }
                this.disSubmit = false;
            });
        }
    }
};
</script>
<style scoped lang="less">

.fixbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    background: #f0f0f2;
}
</style>

