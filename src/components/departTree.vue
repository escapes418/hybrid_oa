<template>
    <div class="sinselector">
        <group>
            <div class="selectbox"  @click="showPopup=true">
                <div class="stitle">{{sTitle}}<span class="srequired" v-if="isRequired">*</span></div>
                <div class="svalue">{{sValue}}</div>
                <div class="svalue" style="color:#999" v-if="sValue === ''">{{sPlaceholder}}</div>
            </div>
        </group>
        <div v-transfer-dom>
            <div class="search" v-if="showPopup">
                <search @on-change="goSearch" v-model="search" @on-cancel="onSearchCancel" @on-clear="onSearchCancel" placeholder="请输入关键字"></search>
            </div>
            <popup v-model="showPopup" height="100%" :popup-style="{zIndex: 1000}" style="-webkit-overflow-scrolling:touch;">
                <div class="popup1">
                    <group class="checkcontent_sin">
                        <scroller lock-y :scrollbar-x=false class="linkbroder">
                            <div class="scrollerbox" >
                                <span v-for="(item, index) in breadcrumb" :key="index">
                                    <span class="jiantou"> / </span><span class="name"  @click="clickBC(item,index)">{{item.name}}</span>
                                </span>
                            </div>
                        </scroller>
                        <div v-for="(item, index) in ArrBox" :key="index">
                            <cell v-if="item.status=='1'&&item.show=='1'" disabled @click.native="setLinkman(index,item)" class="link linkbroder">
                                <span slot="title" class="font-orange">
                                    <span style="vertical-align:middle;color:#222;">{{item.name}}</span>
                                </span>
                                <x-icon class="linkicon" v-if="item.check == '1'" slot="icon" type="ios-checkmark" size="25"></x-icon>
                                <x-icon class="linkicon" v-else slot="icon" type="ios-checkmark-outline" size="25"></x-icon>
                                <span :class="item.check == '0'&& item.children?'fr font-orange linknext':'fr font-select linknext'" @click.stop="clickNext(index,item)">下级</span>
                            </cell>
                            <cell v-if="item.status=='0'&&item.show=='1'" disabled class="link linkbroder">
                                <span slot="title" class="font-orange">
                                    <span style="vertical-align:middle;color:#ddd;">{{item.name}}</span>
                                </span>
                                <x-icon class="linkicon" slot="icon" type="ios-minus-outline" size="25"></x-icon>
                                <span :class="item.check == '0'&& item.children?'fr font-orange linknext':'fr font-select linknext'" @click.stop="clickNext(index,item)">下级</span>
                            </cell>
                        </div>
                    </group>
                </div>
            </popup>
            <box class="schecklistbtn" v-if="showPopup">
                <flexbox>
                    <flexbox-item>
                        <x-button type="primary" @click.native="confirm">确认</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button type="default" @click.native="cancel">取消</x-button>
                    </flexbox-item>
                </flexbox>
            </box>
        </div>
    </div>
</template>

<script lang="ts">
import com from '@/assets/js/common'
import { Vue, Component,Prop, Watch } from "vue-property-decorator";
import {
    Popup,
    Checklist,
    Search,
    Box,
    Group,
    XTextarea,
    XButton,
    Flexbox,
    FlexboxItem,
    Cell,
    Scroller,
    TransferDomDirective as TransferDom
} from "vux";
import { I_breadcrumb} from "./interface/I_departTree";
import { setTimeout } from "timers";
import { NumberRoller } from '@/typings/vux_types';

@Component({
    directives: {
        TransferDom
    },
    components: {
        Popup,
        Checklist,
        Box,
        Search,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Cell,
        Scroller,
    }
})
export default class DepartTree extends Vue{

    @Prop({ type: Number, default: 0 })
    propA: number;

    @Prop({ type: [String, Boolean, Number, Array], default: false })
    sLabel:any

    @Prop({ type: Boolean, default: false })
    isPeople:boolean

    @Prop({ type: String })
    sTitle:string

    @Prop({ type: String })
    sPlaceholder:string

    @Prop({ type: [String, Boolean, Number] })
    sendData:string

    @Prop({ type: Array })
    dataList:any

    @Prop({ type: Boolean })
    isRequired:boolean

    showPopup:boolean = false
    sValue:string = ""
    ArrBox:any = []
    search:string = "" //搜索框
    selectedItem:string = "" //选中的值
    breadcrumb:Array<I_breadcrumb> = [{
        name:"全部",
        id:"1"
    }]

    created() {
        if(this.sLabel){
            this.sValue = this.sLabel;
        } else {
            this.sValue = "";
        }
    }
    @Watch('dataList')
    onDataListChanged(val: any, oldVal: any) {
        this.init()
    }

    @Watch('sendData')
    onSendDataChanged(val: any, oldVal: any) {
        this.init()
    }

    mounted() {
        var _this = this
        setTimeout(function() {//list比key先加载完，就会选不中
            _this.init()
        }, 0);
    }   

    init(): void {
        this.selectedItem = this.sendData;
        this.ArrBox = []
        for(var idx in this.dataList){
            if(this.dataList[idx].id == "1") this.ArrBox.push(this.dataList[idx])  
            this.breadcrumb = [{
                name:"全部",
                id:"1"
            }]
            if(this.sLabel){
                this.sValue = this.sLabel;
            } else {
                this.sValue = "";    
            }
            if(this.dataList[idx].id == this.selectedItem){
                this.sValue = this.dataList[idx].name;
                return
            }
        }
    }
    getPid(d): void {
        for(var i=0;i<this.dataList.length;i++){
            if(this.dataList[i].id == d){
                return this.dataList[i].pId
            }
        }
    }
    goSearch(): void {
        if (this.search == "") {
            this.init()
        } else {
            this.ArrBox = [];
            this.dataList.forEach((item, index) => {
                if (item.name.indexOf(this.search) != -1) {
                    this.ArrBox.push(item);
                }
            });
        }
    }
    confirm(): void {
        this.sValue = "";
        var checkId = ""
        var checkItem = {}
        for(var idx in this.dataList){
            if(this.dataList[idx].check == "1") {
                if(this.dataList[idx].type=="1" && this.isPeople){
                    this.$vux.toast.text("请选择负责人而不是部门")
                    return
                }
                checkId = this.dataList[idx].id
                checkItem = this.dataList[idx]
                this.sValue = this.dataList[idx].name
                break
            }  
        }
        this.search = "";
        this.showPopup = false;
        if (checkId === "") {
            this.$emit("update:selectedItem", "");
        } else {
            this.$emit("update:selectedItem", checkId);
        }
        this.$emit("on-change",checkItem); //添加change事件
    }
    cancel(): void {
        this.search = "";
        this.showPopup = false;
    }
    onSearchCancel(): void {
        this.search = "";
        this.init() 
    }
    setLinkman(index,item): void { //单选
        for (let i in this.dataList) {
            if (item.id == this.dataList[i].id && item.check == "0") {
                this.dataList[i].check = "1";
            } else {
                this.dataList[i].check = "0";
            }
        } 
    }
    clickNext(index,item): void {
        if(item.check == '1' || !item.children) return// 选中就不能选下一级
        this.ArrBox = []
        for(var idx in this.dataList){
            if(this.dataList[idx].pId == item.id) this.ArrBox.push(this.dataList[idx]) 
        };
        var d = com.clone(this.dataList)
        this.setBreadcrumb(d,item.id)
        this.cleanSelect()
    }
    setBreadcrumb(d,id): void {
        var newArr = []
        com.findParent(d,id,newArr);
        this.breadcrumb = newArr;
    }
    clickBC(item,index): void {
        this.ArrBox = []
        for(var idx in this.dataList){
            if(this.dataList[idx].pId == item.id) this.ArrBox.push(this.dataList[idx]) 
        };
        var d = com.clone(this.dataList)
        this.setBreadcrumb(d,item.id)
        this.cleanSelect()
    }
    cleanSelect(): void {
        this.dataList.forEach((el,idx)=>{
            el.check = "0"
        })
    }

}

</script>

<style lang="less">
.sinselector {
    .weui-cells {
        margin-top: 0 !important;
    }
    .vux-no-group-title {
        margin-top: 0 !important;
    }
    .weui-cells:before {
        left: 15px !important;
    }
    .weui-cells:after {
        border-bottom: none !important;
    }
    .weui-textarea {
        text-align: right !important;
    }
    
}
.link {
    position: relative;
    .linkicon {
        display: inline-block;
        margin-right: 5px;
        fill: orange;
        margin-bottom: -8px;
    }
    .red {
        fill: red;
    }
    .font-select{
        color:rgb(255,233,184)
    }
    .linknext{
        position: absolute;
        width: 65px;
        height: 44px;
        top: 0;
        right: 0;
        box-sizing: border-box;
        padding-top: 10px;
        padding-right: 15px;
    }
}
.linkbroder:after{
    content: '';
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-bottom: 1px solid #D9D9D9;
    -webkit-transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
}
.schecklistbtn {
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
.popup1 {
    padding-bottom: 62px;
}
.search {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10000;
    background: #eee;
}
.checkcontent_sin {
    margin-top: 43px;
}
.selectbox{
    display: flex;
    height: 24px;
    padding: 10px 15px;
    font-size: 17px;
    .stitle{
        height: 24px;
        position: relative;
        padding-right:2px; 
        .srequired{
            position: absolute;
            left: -8px;
            color: red;
        }
    }
    .svalue{
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 24px;
        width: 100%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
}
.scrollerbox{
    height: 38px;
    position: relative;
    width:fit-content;
    width: -webkit-fit-content;
    white-space:nowrap;
    box-sizing: border-box;
    padding: 10px 15px;
    font-size: 16px;
    text-align: left;
    .jiantou{
        color:#bbb;
        font-size: 16px;
    }
}
</style>
