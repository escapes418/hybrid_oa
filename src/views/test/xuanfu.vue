<template>
    <div v-if="isReady" class="cccccc">
        <group title='基本信息' label-margin-right="1em"    >
            <x-input title="当日电话拜访" v-model="applyData.custPhotoCount" readonly></x-input>
            <x-input title="当日上门拜访" v-model="applyData.custVisitCount" readonly></x-input>
            <x-input title="当日意向数量" placeholder='请输入' type="number" v-model.trim="applyData.custIntentionCount">
                <span slot="label">当日意向数量<span class="required">*</span></span>
            </x-input>
            <x-input title="当日签约数量" placeholder='请输入' type="number" v-model.trim="applyData.custSignCount">
                <span slot="label">当日签约数量<span class="required">*</span></span>
            </x-input>
            <x-input title="明日拜访数量" placeholder='请输入' type="number" v-model.trim="applyData.afterVisitCount">
                <span slot="label">明日拜访数量<span class="required">*</span></span>
            </x-input>
            <x-textarea title="明日工作计划" placeholder='请输入' :autosize="true" v-model.trim="applyData.afterDailyPlan">
                <span slot="label" style="padding-right:10px;">明日工作计划<span class="required">*</span></span>
            </x-textarea>
            <x-textarea title="备注" :autosize="true" v-model.trim="applyData.remarks"></x-textarea>
            <RemoteSearch sTitle='关联项目' sPlaceholder='请选择' :rOption="rOption" :sendData="applyData.afterVisitCount" :selectedItem.sync="applyData.afterVisitCount"></RemoteSearch>

        </group>
        <!-- 悬浮球 -->
        <div v-if="!isShow" class="xuanfu" id="moveDiv"
        @mousedown="down" @touchstart="down"
        @mousemove="move" @touchmove="move"
        @mouseup="end" @touchend="end"
        >
                <div class="yuanqiu">
        <!-- {{pageInfo.totalPage}} -->
        </div>
        </div>
        <group title='客户情况' label-margin-right="1em" v-for="(item, index) in applyData.dailyCustMaintenanceList" :key="index">
            <box gap="10px 15px">
                <div style="height:26px">
                    <span class="fr font-orange" @click="delItem(index)">删除</span>
                </div>
            </box>
            <sinSelector sTitle='客户名称' :isRequired="true" sPlaceholder='请选择' @on-change="changeCust(index)" :dataList="custMaintenanceList" :sendData="item.custId" :selectedItem.sync="item.custId"></sinSelector>
            <x-input title="拜访类型" v-model="item.visitTypeName" readonly></x-input>
            <x-input title="维护时间" v-model="item.custMaintenanceDateTime" readonly></x-input>
            <x-textarea title="维护内容" :autosize="true" v-model="item.custMaintenanceContent" readonly></x-textarea>
        </group>
        <div class="add-btn">
            <span class="pointer" @click="addItem">新增客户情况</span>
        </div>
        <group title='发送对象' label-margin-right="1em" style="margin-bottom:62px">
            <mulSelectors sTitle='发送对象' :max="0" :isRequired="true" sPlaceholder='请选择' :dataList="sendPeopelList" :sendData="sendToList" :selectedItem.sync="sendToList"></mulSelectors>
        </group>
        <box class="fixbtn">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="submit">提交</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <satelBtn>
            <div class="button-child" @click="showNew">
                <span style="font-size:12px;color:#ba3080;">新建</span>
            </div>
            <div class="button-child" @click="backStep">
                <span style="font-size:12px;color:#ba3080;">新建1</span>
            </div>
            <div class="button-child" @click="backStep3">
                <span style="font-size:12px;color:#ba3080;">新建2</span>
            </div>
        </satelBtn>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import sinSelector from '@/components/sinSelector'
import mulSelectors from '@/components/mulSelectors'
import RemoteSearch from '@/components/RemoteSearch'
// import departTree2 from "@/components/departTree2.vue";
import MapInfo from '@/components/MapInfo'
import api from '@/assets/api/index.api'
import Utils from './utils';
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';
import { resolve } from 'path';
import satelBtn from "./satelliteBtn.vue";


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
        mulSelectors,
        MapInfo,
        RemoteSearch,
        satelBtn,
        // departTree2,
    },
    data() {
        return {
            isReady:false,
            applyData:{
                afterDailyPlan:"",//明日计划
                afterVisitCount: undefined,//明日拜访客户数量
                custIntentionCount: undefined,//当日意向客户数量 
                custPhotoCount: 0,//当日电话拜访数量 
                custSignCount: undefined,//当日签约数量
                custVisitCount: 0,//当日上门拜访数量 
                remarks:"",
                dailyCustMaintenanceList:[
                    {
                    custId: "",//客户id ,
                    custMaintenanceContent: "",//维护内容 
                    custMaintenanceDate: "",//维护时间
                    custMaintenanceDateTime: "",
                    custName: "",//客户name
                    visitType: "",//拜访类型
                    visitTypeName: "",
                    }
                ],
                sendToList:[],
            },
            sendToList:[],
            saveTimer: false,
            sendPeopelList: [],
            custMaintenanceList: [],
            mapdata:{
                nodeName: "武汉站",
                nodeAddress: "湖北省武汉市江汉区汉兴街街道新东方通讯香缇美景",
                nodeId: "dc2230acc9b04f6e94dcb233f8fc7816",
                lat: 30.617539,
                lng: 114.228632
                },
            rOption:{
                api:api.queryDictInfo,
                params:{
                    dictType: "oa_project",
                },
                search:"projectName",
                key:"value",
                value:"label",
            },
            departList: [],


            flags: false,
            position: { x: 0, y: 0 },
            nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
            isShow:false,
        }
    },
    computed: {

    },
    created() {
        this.init();
    },
    beforeDestroy(){
        // clearInterval(this.saveTimer)
    },
    methods: {
        init() {
            // this.initAutoSave()
            this.getCustMaintenance();
            this.getSendPeopelList();
            this.getSend()
            this.getTreeList()
        },
        initAutoSave(){
            var _this = this;
            this.getAutoSaveTime().then((getData)=>{
                com.comGetStorage("autoSave").then(rtn => {
                    if(rtn.LogMarketApply !== undefined) _this.applyData = rtn.LogMarketApply;//给表单赋值
                    _this.isReady = true;
                    _this.saveTimer = setInterval(()=>{
                        rtn.LogMarketApply = _this.applyData;
                        com.comSetStorage("autoSave", rtn);
                    },10000)
                })
            })
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
        getTreeList() {
            com.covertHttp(api.orgAndUserInfo,{queryType:"1"}).then((rtn) => {
                this.departList = com.hasChildren(rtn.data)
            });
            // com.covertHttp(api.orgAndUserInfo,{queryType:"2"}).then((rtn) => {
            //     var list = com.addTreePeopel(rtn.data)
            //     this.peopleTreeList = com.hasChildren(list)
            // });
        },
        getSend(){
            // com.covertHttp(api.querySendToByUserId,{
            //     dailyTemplate:1,
            // }).then(rtn => {
            //     var d = rtn.data || []
            //     console.log(d)
            //     d.forEach((item, index)=>{
            //         this.sendToList.push(item.sendToId);
            //     });
            // });
        },
        getSendPeopelList() {
            com.covertHttp(api.escortEmployee).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.sendPeopelList.push({
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
                    this.delAutoSave()
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                }
            });
        },
        delAutoSave() {
            clearInterval(this.saveTimer)
            com.comGetStorage("autoSave").then(rtn => {
                delete rtn.LogMarketApply
                com.comSetStorage("autoSave", rtn);
            })
        },
        backStep(){
            this.$router.go(-1)
        },
        changeCust(index) {
            if(this.applyData.dailyCustMaintenanceList[index].custId == "") return;
            this.custMaintenanceList.forEach((el,idx)=>{
                if(el.key == this.applyData.dailyCustMaintenanceList[index].custId){
                    this.applyData.dailyCustMaintenanceList[index].custMaintenanceContent = el.custMaintenanceContent;
                    this.applyData.dailyCustMaintenanceList[index].custMaintenanceDate = el.custMaintenanceDate;
                    this.applyData.dailyCustMaintenanceList[index].custMaintenanceDateTime = el.custMaintenanceDateTime;
                    this.applyData.dailyCustMaintenanceList[index].custName = el.custName;
                    this.applyData.dailyCustMaintenanceList[index].visitType = el.visitType;
                    this.applyData.dailyCustMaintenanceList[index].visitTypeName = el.visitTypeName;
                }
            })
            this.changeCount()
        },
        changeCount(){
            this.applyData.custPhotoCount = 0;
            this.applyData.custVisitCount = 0;
            this.applyData.dailyCustMaintenanceList.forEach((el,idx)=>{
                if(el.visitType == 1){
                    this.applyData.custVisitCount ++;
                } else if(el.visitType == 2){
                    this.applyData.custPhotoCount ++;
                }
            })
        },
        addItem() {
            this.applyData.dailyCustMaintenanceList.push({
                custId: "",
                custMaintenanceContent: "",
                custMaintenanceDate: "",
                custMaintenanceDateTime: "",
                custName: "",
                visitType: "",
                visitTypeName:"",
            })
        },
        delItem(index) {
            var _this = this;
            // if(this.applyData.dailyCustMaintenanceList.length <= 1){
            //     this.$vux.toast.text('无法继续删除');
            //     return;
            // }
            this.$vux.confirm.show({
                title: "是否删除",
                content: "确定执行操作？",
                onCancel() {},
                onConfirm() {
                    _this.applyData.dailyCustMaintenanceList.splice(index, 1);
                    _this.changeCount()
                }
            });
        },




        down(){
            this.flags = true;
            var touch;
            if(event.touches){
            touch = event.touches[0];
            }else {
            touch = event;
            }
            this.position.x = touch.clientX;
            this.position.y = touch.clientY;
            this.dx = moveDiv.offsetLeft;
            this.dy = moveDiv.offsetTop;
        },
        move(){
            if(this.flags){
            var touch ;
            if(event.touches){
            touch = event.touches[0];
            }else {
            touch = event;
            }
            this.nx = touch.clientX - this.position.x;
            this.ny = touch.clientY - this.position.y;
            this.xPum = this.dx+this.nx;
            this.yPum = this.dy+this.ny;
            moveDiv.style.left = this.xPum+"px";
            moveDiv.style.top = this.yPum +"px";
            //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
            // document.addEventListener("touchmove",function(){
            // event.preventDefault();
            // },false);
            }
        },
        //鼠标释放时候的函数
        end(){
            this.flags = false;
        },
        backStep(){
            console.log(2222)
        },
        showNew(){
            console.log(1111)
        },
        backStep3(){
            console.log(3333)
        }
    },
}
</script>
<style lang="less" scoped>
// @import "../../assets/css/common/reset.fix.less";
// @import "../../assets/css/common/base.less";
// @import "../../assets/css/index.less";
.fixbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10000;
    background: #f0f0f2;
}




.xuanfu {
    height: 1.6rem;
    width: 1.6rem;
    /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
    z-index: 999;
    position: fixed;
    top: 4.2rem;
    right: 3.2rem;
    border-radius: 0.45rem;
    background-color: rgba(0, 0, 0, 0.55);
 }
 .yuanqiu {
    height: 0.8rem;
    width: 0.8rem;
    border: 0.15rem solid rgba(140, 136, 136, 0.5);
    margin: 0.27rem auto;
    color: #000000;
    font-size: 1.6rem;
    line-height: 2.7rem;
    text-align: center;
    border-radius: 100%;
    background-color: #ffffff;
 }
 .cccccc{
     -webkit-overflow-scrolling:touch;
 }
</style>