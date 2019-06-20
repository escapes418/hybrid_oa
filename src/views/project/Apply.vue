<template>
    <div>
        <group title='基本信息' label-margin-right="1em"    >
            <x-input title="项目名称" :max="50" v-model.trim="applyData.projectName" placeholder='请输入'>
                <span slot="label">项目名称<span class="required">*</span></span>
            </x-input>
            <sinSelector sTitle='项目类型' :isRequired="true" sPlaceholder='请选择' :dataList="dictionary.projectType" :sendData="applyData.projectType" :selectedItem.sync="applyData.projectType"></sinSelector>
            <RemoteSearch sTitle='客户名称' :isRequired="true" sPlaceholder='请选择' :rOption="custOption" :sendData="applyData.custInfoId" :selectedItem.sync="applyData.custInfoId"></RemoteSearch>
            <mulReSelet sTitle='企业名称' :isRequired="true" sPlaceholder='请选择' :rOption="holderOption" :sendData="applyData.holderCode" :selectedItem.sync="applyData.holderCode"></mulReSelet>
            <departTree sTitle='归属部门' :isRequired="true" sPlaceholder='请选择' :dataList="departList" :sendData="applyData.officeId" :selectedItem.sync="applyData.officeId"></departTree>
            <departTree sTitle='市场负责人' :isRequired="true" :isPeople="true" sPlaceholder='请选择' :dataList="marketLeaderList" :sendData="applyData.marketLeaderId" :selectedItem.sync="applyData.marketLeaderId"></departTree>
            <departTree sTitle='项目负责人' :isRequired="true" :isPeople="true" sPlaceholder='请选择' :dataList="projectLeaderList" :sendData="applyData.projectLeaderId" :selectedItem.sync="applyData.projectLeaderId"></departTree>
            <departTree sTitle='实施负责人' :isRequired="true" :isPeople="true" sPlaceholder='请选择' :dataList="impleLeaderList" :sendData="applyData.impleLeaderId" :selectedItem.sync="applyData.impleLeaderId"></departTree>
            <x-textarea title="备注"  :max="200" :autosize="true" v-model.trim="applyData.remarks"></x-textarea>
        </group>
        
        <group title='实施节点' label-margin-right="1em" v-for="(item, index) in applyData.projectNodeReqs" :key="index">
            <box gap="10px 15px">
                <div style="height:26px">
                    <span class="fr font-orange" @click="delItem(index)">删除</span>
                </div>
            </box>
            <x-input title="地点节点" :max="50" v-model.trim="item.nodeName" placeholder='请输入'></x-input>
            <MapInfo sTitle='节点地址' sPlaceholder='请选择' :index="index" :itemData="item" @on-change="changemap"></MapInfo>
        </group>
        <div class="add-btn" style="margin-bottom:15px">
            <span class="pointer" @click="addItem">新增节点</span>
        </div>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" :disabled="disSubmit" @click.native="submit">提交</x-button>
                </flexbox-item>
            </flexbox>
        </box>
    </div>
</template>
<script lang="ts">
import com from '@/assets/js/common'
import sinSelector from '@/components/sinSelector.vue'
import mulReSelet from "@/components/mulReSelet.vue";
import RemoteSearch from "@/components/RemoteSearch.vue";
import departTree from "@/components/departTree.vue";
import api from '@/assets/api/index.api'
import Utils from './utils';
import MapInfo from '@/components/MapInfo.vue'
import { QUERYDICT,APPLY_data,OPTION,TREELIST,I_Dictionary} from "./interface";
import { Group, XInput,Selector, XButton,Box,Flexbox,XTextarea,Checklist,Confirm, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';

import { Vue, Component } from "vue-property-decorator";
@Component({
    components: {
        Group,
        Selector,
        XInput,
        Confirm,
        XButton,
        Flexbox,
        FlexboxItem,
        Box,
        Checklist,
        sinSelector,
        XTextarea,
        MapInfo,
        mulReSelet,
        departTree,
        RemoteSearch,
    }
})
export default class projectApply extends Vue {
    applyData:APPLY_data = {
        custInfoId: "", //归属客户
        id: "",
        holderCode: [],
        impleLeaderId: "", //实施负责人
        marketLeaderId: "",//市场负责人 
        officeId: "",//归属部门 
        projectLeaderId: "",//项目负责人 
        projectName: "",//项目名称
        projectNodeReqs: [{
            lat: "",
            lng: "",
            nodeAddress: "",
            nodeId: "",
            nodeName: "",
        }],
        projectType: "",
        remarks: "",
    }
    departList:Array<TREELIST> = []
    marketLeaderList:Array<TREELIST> = []
    projectLeaderList:Array<TREELIST> = []
    impleLeaderList:Array<TREELIST> = []
    // peopelList = []
    dictionary:I_Dictionary = {
        projectType: [],
    }
    custOption:OPTION = {
        api:api.queryCustInfos,
        params:{ },
        search:"custName",
        key:"id",
        value:"custName",
    }
    holderOption:OPTION = {
        api:api.queryCompanyName,
        params:{ },
        search:"companyName",
        key:"companyCode",
        value:"companyName",
    }
    disSubmit= false;
    created() {
        this.init();
        this.getDictionary();
    }
    activated() {
        this.init();
        this.getDictionary();
    }
    mounted() {

    }
    init(): void {
        this.getTreeList()
    }
    getTreeList(): void {
        com.covertHttp(api.orgAndUserInfo,{queryType:"1"}).then((rtn:Ajax.AjaxResponse) => {
            this.departList = com.hasChildren(rtn.data)
        });
        com.covertHttp(api.orgAndUserInfo,{queryType:"2"}).then((rtn:Ajax.AjaxResponse) => {
            var list = com.addTreePeopel(rtn.data)
            var peopelList = com.hasChildren(list)
            console.log(peopelList)
            this.marketLeaderList = com.clone(peopelList)
            this.projectLeaderList = com.clone(peopelList)
            this.impleLeaderList = com.clone(peopelList)
        });
    }
    getDictionary(): void {
        com.comGetStorage('queryDict').then((data:QUERYDICT) => { 
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
            this.dictionary.projectType = selectDic("project_type"); 
        });
    }
    submit(): void {
        var _this = this
        if (!Utils.valiApply(this)) return; //校验  
        this.disSubmit = true;
        this.$vux.confirm.show({
            title: "是否提交",
            content: "确定执行操作？",
            onCancel() {
                _this.disSubmit = false;
            },
            onConfirm() {
                _this.handleApply();
            }
        });
    }
    handleApply(): void {
        var params = com.clone(this.applyData);
        com.covertHttp(api.saveProjectInfo,params).then((rtn:Ajax.AjaxResponse) => {
            if(rtn.status == 0) {
                this.$vux.toast.text(rtn.message);
                this.backStep()
            } else {
                // this.$vux.toast.text(rtn.message || '服务器异常');
            }
            this.disSubmit = false;
        });
    }
    backStep(): void {
        this.$router.go(-1)
    }
    addItem(): void {
        this.applyData.projectNodeReqs.push({
            lat: "",
            lng: "",
            nodeAddress: "",
            nodeId: "",
            nodeName: "",
        })
    }
    delItem(index:number): void {
        var _this = this;
        this.$vux.confirm.show({
            title: "是否删除",
            content: "确定执行操作？",
            onCancel() {},
            onConfirm() {
                _this.applyData.projectNodeReqs.splice(index, 1);
            }
        });
    }
    changemap(d): void {
        this.applyData.projectNodeReqs[d.index].lat = d.lat
        this.applyData.projectNodeReqs[d.index].lng = d.lng
        this.applyData.projectNodeReqs[d.index].nodeAddress = d.nodeAddress
        this.applyData.projectNodeReqs[d.index].nodeId = d.nodeId
    }
}

</script>
<style lang="less">
@import "../../assets/css/common/reset.fix.less";
@import "../../assets/css/common/base.less";
@import "../../assets/css/index.less";
</style>