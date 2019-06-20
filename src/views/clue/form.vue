<template>
    <div>
        <group title='基本信息' label-margin-right="1em">
            <x-input title="客户名称" :max="50" v-model.trim="filter.custName" placeholder='请输入客户名称'>
                <span slot="label">客户名称<span class="required">*</span></span>
            </x-input>
            <x-input title="客户简称" v-model.trim="filter.custAbbreviation" :readonly='isReadonly' placeholder='请输入客户简称'></x-input>

            <x-address title="所属区域" :hide-district="true" v-model="filter.areaId" :list="addressData"
              value-text-align="left" 
             placeholder="请选择区域"></x-address>
            <sinSelector1 sTitle='客户分类' sPlaceholder='请选择' :dataList="custClassify"  :sendData="filter.custClassify" :selectedItem.sync="filter.custClassify"></sinSelector1>
            <x-input title="规模(万吨/月)" :max="50" type="number" v-model.trim="filter.custCompanySize" placeholder='请输入'></x-input>
            <mulSelector v-if="isReady" sTitle='运输方式' sPlaceholder='请选择' :dataList="tranList"  :sendData="filter.tranMethod" :selectedItem.sync="filter.tranMethod"></mulSelector>
            <x-input title="联系人" :max="50" v-model.trim="filter.custLinkmanName" placeholder='请输入'></x-input>
            <x-input title="联系人职位" :max="50" v-model.trim="filter.linkmanPost" placeholder='请输入'></x-input>
            <x-input title="联系方式" :max="50" v-model.trim="filter.linkmanPhone" placeholder='请输入'></x-input>
            <!-- <x-input title="市场负责人" v-model.trim="userInfo.userName" readonly></x-input> -->
            <x-textarea title="客户现状" :autosize="true" placeholder="请输入" v-model.trim="filter.custActuality" :max="200"></x-textarea>
            <x-textarea title="业务概况" :autosize="true" placeholder="请输入" v-model.trim="filter.custBusinessProfile" :max="200"></x-textarea>
            <x-textarea title="线索说明" :autosize="true" placeholder="请输入" v-model.trim="filter.custClueExplain" :max="200">
                <span slot="label" style="padding-right:32px;">线索说明<span class="required">*</span></span>
            </x-textarea>
        </group>
        <!-- <group title="客户现状" label-margin-right="1em">
            <x-textarea v-model.trim="filter.custActuality" :autosize="true" :max="200"></x-textarea>
        </group>
        <group title="业务概况" label-margin-right="1em">
            <x-textarea v-model.trim="filter.custBusinessProfile" :autosize="true" :max="200"></x-textarea>
        </group>
        <group title="线索说明" label-margin-right="1em">
            <x-textarea v-model.trim="filter.custClueExplain" :autosize="true" :max="200"></x-textarea>
        </group> -->
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" :disabled="isSubmit" @click.native="isSubmit=true">保存</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <div v-transfer-dom>
            <confirm v-model="isSubmit" title="提交线索列表" @on-cancel="isSubmit=false" @on-confirm="submit(true)">
                <p style="text-align:center;">{{ ('确定执行操作?') }}</p>
            </confirm>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from '@/assets/api/axios'
import XHR from '@/assets/js/XHR';
import com from '@/assets/js/common'
import mulSelector from '@/components/mulSelector'
import sinSelector from '@/components/sinSelector'
import api from '@/assets/api/index.api'
import { mapState, mapGetters } from 'vuex'
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';


export default {
    name: "ClueForm",
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
        sinSelector1: sinSelector,
        sinSelector2: sinSelector,
        mulSelector:mulSelector
    },
    data() {
        return {
            isSubmit:false,
            isReadonly:false,
            isReady:false,
            custClassify: [], //客户分类
            tranList:[],
            userInfo:{},
            filter: {//筛选条件
                areaId :[],// 所属区域id ,
                custAbbreviation :undefined,// 客户简称 ,
                custActuality : undefined,// 客户现状 ,
                custBusinessProfile:undefined,// 业务概况 ,
                custClassify :undefined,// 客户分类：1000+万吨/月 500~1000万吨/月 0~500万吨/月 ,
                custClueExplain :undefined,// 线索说明 ,
                custCompanySize:undefined,// 规模 ,
                custLinkmanName:undefined,// 联系人 ,
                custName :undefined,// 客户名称 ,
                linkmanPhone:undefined,// 联系方式 ,
                linkmanPost:undefined,// 职位 ,
                tranMethod :[],// 运输方式:汽运，铁运，船运
                oldCustName:undefined
            },
            disSubmit: false,
        }
    },
    computed: {
        ...mapState({
            addressData: state => state.addressData,
        })
    },
    created() {
        this.init();
        this.getAddressData();
    },
    methods: {
        init() {
            com.comGetStorage('userInfo').then(res => {
                this.userInfo = res;
            })
            com.covertHttp(api.queryDictInfo,{dictType: "cust_classify"}).then(rtn => {
                if (rtn.status == 0) {
                    // this.projectNameOpt = rtn.data;
                    rtn.data.forEach((item,index)=>{
                        this.custClassify.push({
                            ...item,
                            value: item.label,
                            key: item.value,
                        })
                    })
                }
            })
            com.covertHttp(api.queryDictInfo,{dictType: "tran_method"}).then(rtn => {
                if (rtn.status == 0) {
                    rtn.data.forEach((item,index)=>{
                        this.tranList.push({
                            ...item,
                            value: item.label,
                            key: item.value,
                        })
                    })
                }
            })
            this.getDetail();
        },
        getDetail() {
            if (this.$route.query.key) {
                com.covertHttp(api.custInfoClueDetail,{
                    id: this.$route.query.key,
                })
                .then(res => {
                    if(res.status == 0) {
                        res.data.tranMethod = res.data.tranMethod || []
                        this.filter.tranMethod = res.data.tranMethod
                        // console.log(this.filter.tranMethod)
                        res.data.custCompanySize = Number(res.data.custCompanySize) || undefined;
                        this.filter.custCompanySize = res.data.custCompanySize;

                        this.filter.areaId = res.data.areaId || []
                        this.filter.oldCustName = res.data.custName;//老的客户名称
                        this.filter.id = this.$route.query.key
                        this.filter.custAbbreviation = res.data.custAbbreviation || undefined;// 客户简称 ,
                        this.filter.custActuality = res.data.custActuality || undefined;// 客户现状 ,
                        this.filter.custBusinessProfile = res.data.custBusinessProfile || undefined;// 业务概况 ,
                        this.filter.custClassify = res.data.custClassify || undefined;// 客户分类：1000+万吨/月 500~1000万吨/月 0~500万吨/月 ,
                        this.filter.custClueExplain = res.data.custClueExplain ||undefined;// 线索说明 ,
                        this.filter.custLinkmanName=res.data.custLinkmanName || undefined;// 联系人 ,
                        this.filter.custName = res.data.custName || undefined;// 客户名称 ,
                        this.filter.linkmanPhone = res.data.linkmanPhone || undefined;// 联系方式 ,
                        this.filter.linkmanPost = res.data.linkmanPost || undefined// 职位 ,
                        
                    } else {
                        // this.$vux.toast.text(rtn.message || '服务器异常');
                    }
                    this.isReady = true;
                })
            }else{
                this.isReady = true;
            }
            
            
        },
        getAddressData() {
            if(this.addressData.length == 0) {
                com.covertHttp(api.areaInfo).then(rtn => {
                    this.$store.dispatch('setAddressData', rtn.data);
                })
            }
        },
        submit() {
            if(this.filter.custCompanySize == '0'){
                this.filter.custCompanySize = 0
            }else{
                this.filter.custCompanySize = Number(this.filter.custCompanySize) || undefined
            }
            
            if(this.clueFormVali(this)){
                com.covertHttp(api.saveCustInfoClue,this.filter).then(res=>{
                    if(res.status == 0){
                        this.$vux.toast.text(res.message || "保存成功");
                        this.$router.push({path:'/clue/list'});
                        com.delKeepAlive(this,["ClueList"])
                    }
                })
            }
            
        },
        clueFormVali(self) {
            var flag = true;
            if (!self.filter.custName||/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(self.filter.custName) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(self.filter.custName)) {
                this.$vux.toast.text("请正确填写客户名称！");
                flag = false;
            }
            else if (self.filter.custCompanySize&&(!/(^[0-9]\d*$)/.test(self.filter.custCompanySize)) || self.filter.custCompanySize == 0) {
                this.$vux.toast.text("请正确填写运输规模！");
                flag = false;
            }
            
            else if(self.filter.linkmanPhone && !/^1[345678][0-9]{9}$/.test(self.filter.linkmanPhone)){
                this.$vux.toast.text("请正确填写联系人联系方式！");
                flag = false;
            }
        
            else if(!self.filter.custClueExplain){
                this.$vux.toast.text("请填写线索说明！");
                flag = false;
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
.ml-8em{
    margin-left: 8em;
}
.weui-cells{
    margin-top: 0 !important;
}
.btn-bottom{
    position: fixed;
    bottom: 20px;
}
</style>

