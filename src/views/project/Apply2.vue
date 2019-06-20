<template>
    <div>
        <group title='基本信息' label-margin-right="1em"    >
            <x-input title="项目名称" v-model="applyData.projectName">
                <span slot="label">项目名称<span class="required">*</span></span>
            </x-input>
            <sinSelector sTitle='项目类型' :isRequired="true" sPlaceholder='请选择' :dataList="custMaintenanceList" :sendData="applyData.projectType" :selectedItem.sync="applyData.projectType"></sinSelector>
            <sinSelector sTitle='客户名称' :isRequired="true" sPlaceholder='请选择' :dataList="custMaintenanceList" :sendData="applyData.custInfoId" :selectedItem.sync="applyData.custInfoId"></sinSelector>
            <x-input title="企业名称" v-model="applyData.holderCode"></x-input>
            <sinSelector sTitle='归属部门' :isRequired="true" sPlaceholder='请选择' :dataList="custMaintenanceList" :sendData="applyData.officeId" :selectedItem.sync="applyData.officeId"></sinSelector>
            <sinSelector sTitle='市场负责人' :isRequired="true" sPlaceholder='请选择' :dataList="peopelList" :sendData="applyData.marketLeaderId" :selectedItem.sync="applyData.marketLeaderId"></sinSelector>
            <sinSelector sTitle='项目负责人' :isRequired="true" sPlaceholder='请选择' :dataList="peopelList" :sendData="applyData.projectLeaderId" :selectedItem.sync="applyData.projectLeaderId"></sinSelector>
            <sinSelector sTitle='实施负责人' :isRequired="true" sPlaceholder='请选择' :dataList="peopelList" :sendData="applyData.impleLeaderId" :selectedItem.sync="applyData.impleLeaderId"></sinSelector>
            <x-textarea title="备注" :autosize="true" v-model.trim="applyData.remarks"></x-textarea>
        </group>
        
        <group title='实施节点' label-margin-right="1em" v-for="(item, index) in applyData.projectNodeReqs" :key="index">
            <box gap="10px 15px">
                <div style="height:26px">
                    <span class="fr font-orange" @click="delItem(index)">删除</span>
                </div>
            </box>
            <x-input title="地点节点" v-model="item.nodeName"></x-input>
            <MapInfo sTitle='节点地址' :isRequired="true" sPlaceholder='请选择' :index="index" :itemData="item" @on-change="changemap"></MapInfo>
        </group>
        <div class="add-btn" style="margin-bottom:62px">
            <span class="pointer" @click="addItem">新增客户情况</span>
        </div>
        <box class="fixbtn">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="submit">提交</x-button>
                </flexbox-item>
            </flexbox>
        </box>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import sinSelector from '@/components/sinSelector'
import api from '@/assets/api/index.api'
import Utils from './utils.ts';
import MapInfo from '@/components/MapInfo.vue'
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';
import { resolve } from 'path';


export default {
    name: "LogMarketApply",
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
        sinSelector,
        MapInfo,
    },
    data() {
        return {
            applyData:{
                custInfoId: "", //归属客户
                id: "",
                impleLeaderId: "", //实施负责人
                marketLeaderId: "",//市场负责人 
                officeId: "",//归属部门 
                projectLeaderId: "",//项目负责人 
                projectName: "",//项目名称
                projectNodeReqs: [
                    {
                    lat: "",
                    lng: "",
                    nodeAddress: "",
                    nodeId: "",
                    nodeName: "",
                    }
                ],
                projectType: "",
                remarks: ""
                },
            sendToList:[],
            peopelList: [],
            custMaintenanceList: [],
            dictionary: {
                abnormalStatus: [],
            },
        }
    },
    computed: {

    },
    created() {
        this.init();
        this.getDictionary();
    },
    methods: {
        init() {
            // this.initAutoSave()
            this.getCustMaintenance();
            this.getPeopelList();
        },
        // initAutoSave(){
        //     var _this = this;
        //     this.getAutoSaveTime().then((getData)=>{
        //         com.comGetStorage("autoSave").then(rtn => {
        //             if(rtn.LogMarketApply !== undefined) _this.applyData = rtn.LogMarketApply;//给表单赋值
        //             _this.isReady = true;
        //             _this.saveTimer = setInterval(()=>{
        //                 rtn.LogMarketApply = _this.applyData;
        //                 com.comSetStorage("autoSave", rtn);
        //             },10000)
        //         })
        //     })
        // },
        getDictionary() {
            com.comGetStorage('queryDict').then(data => { 
                var getData = data.dict 
                function selectDic(type) {
                    let temp = [];
                    for (var i = 0; i < getData.length; i++) {
                        if (getData[i].type == type) {
                            temp.push({
                                ...getData[i],
                                key:getData[i].value,
                                value:getData[i].name,
                            });
                        }
                    }
                    return temp;  
                }
                this.dictionary.abnormalStatus = selectDic("node_has_abnormal_status"); //异常情况   
            });
        },
        getAutoSaveTime() {
            return new Promise((resolve, reject) => {
                com.comGetStorage('queryDict').then(data => { 
                    var getData = data.dict 
                    let temp = 10000;
                    for (var i = 0; i < getData.length; i++) {
                        if (getData[i].type == "auto_save") {
                            temp = parseInt(getData[i].value)
                            break
                        }
                    } 
                    if(typeof temp == "number"){
                        resolve(temp)
                    } else{
                        resolve(10000)
                    }
                });
            })
        },
        getPeopelList() {
            com.covertHttp(api.escortEmployee).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.peopelList.push({
                        ...item,
                        value: item.name,
                        key: item.id,
                    });
                });
            });
        },
        getCustMaintenance() {
            com.covertHttp(api.queryDailyCustMaintenance).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.custMaintenanceList.push({
                        ...item,
                        value: item.custName,
                        key: item.custId,
                    });
                });
            });
        },
        submit() {
            var _this = this
            if (!Utils.valiMarketApply(this)) return; //校验  
            this.$vux.confirm.show({
                title: "是否提交",
                content: "确定执行操作？",
                onCancel() {},
                onConfirm() {
                    _this.handleApply();
                }
            });
        },
        handleApply(){
            var _this = this;
            var params = com.clone(_this.applyData);
            params.sendToList = this.sendToList;
            com.covertHttp(api.saveMarketDaily,params).then(rtn => {
                if(rtn.status == 0) {
                    this.$vux.toast.text(rtn.message);
                    this.$router.go(-1);
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                }
            });
        },
        backStep(){
            this.$router.go(-1)
        },
        addItem() {
            this.applyData.projectNodeReqs.push({
                lat: "",
                lng: "",
                nodeAddress: "",
                nodeId: "",
                nodeName: "",
            })
        },
        delItem(index) {
            var _this = this;
            this.$vux.confirm.show({
                title: "是否删除",
                content: "确定执行操作？",
                onCancel() {},
                onConfirm() {
                    _this.applyData.projectNodeReqs.splice(index, 1);
                }
            });
        },
        changemap(d){
            this.applyData.projectNodeReqs[d.index].lat = d.lat
            this.applyData.projectNodeReqs[d.index].lng = d.lng
            this.applyData.projectNodeReqs[d.index].nodeAddress = d.nodeAddress
            this.applyData.projectNodeReqs[d.index].nodeId = d.nodeId
            console.log(this.applyData)
        },
    },
}
</script>
<style lang="less">
@import "../../assets/css/common/reset.fix.less";
@import "../../assets/css/common/base.less";
@import "../../assets/css/index.less";
// .fixbtn {
//     width: 100%;
//     position: fixed;
//     bottom: 0;
//     right: 0;
//     left: 0;
//     padding: 10px;
//     box-sizing: border-box;
//     z-index: 10000;
//     background: #f0f0f2;
// }
</style>