<template>
    <div class="approval_apply">
        <group title='基本信息' label-margin-right="1em" >
            <x-input title="客户编号" readonly v-model="applyData.custCode"></x-input>
            <x-input title="客户名称" :max="50" placeholder="请输入" v-model.trim="applyData.custName">
                <span slot="label">客户名称<span class="required">*</span></span>
            </x-input>
            <x-input title="客户简称" :max="50" placeholder="请输入" v-model.trim="applyData.custAbbreviation"></x-input>
            <x-input title="归属区域" v-model.trim="baseInfo.officeName" readonly></x-input>
            <x-input title="客户来源" :max="200" placeholder="请输入" v-model.trim="applyData.custSource"></x-input>
            <x-address class="reddot" title="地址" inline-desc="*" :hide-district="true" v-model="custAddressCode" :list="addressData" placeholder="请选择地址"></x-address>
            <x-input title="详细地址" :max="100" placeholder="请输入" v-model.trim="applyData.custAddress">
                <span slot="label">详细地址<span class="required">*</span></span>
            </x-input>
        </group>
        <group title='业务情况' label-margin-right="1em">
            <sinSelector sTitle='所属行业' sPlaceholder='请选择' :isRequired="true" :dataList="dictionary.custTrades" :sendData="applyData.custTrades" :selectedItem.sync="applyData.custTrades"></sinSelector>
            <sinSelector sTitle='业务类型' sPlaceholder='请选择' :dataList="dictionary.custBusinessType" :sendData="applyData.custBusinessType" :selectedItem.sync="applyData.custBusinessType"></sinSelector>
            <x-input title="规模(万元/月)" :max="50" placeholder="请输入" type="number" v-model.number="applyData.custCompanySize"></x-input>
            <sinSelector sTitle='运力组织方式' sPlaceholder='请选择' :dataList="dictionary.custPowerMode" :sendData="applyData.custPowerMode" :selectedItem.sync="applyData.custPowerMode"></sinSelector>
            <sinSelector sTitle='发货方式' sPlaceholder='请选择' :dataList="dictionary.custDeliverMode" :sendData="applyData.custDeliverMode" :selectedItem.sync="applyData.custDeliverMode"></sinSelector>
            <sinSelector sTitle='收货方式' sPlaceholder='请选择' :dataList="dictionary.custReceiveMode" :sendData="applyData.custReceiveMode" :selectedItem.sync="applyData.custReceiveMode"></sinSelector>
            <sinSelector sTitle='结算对象' sPlaceholder='请选择' :dataList="dictionary.custBalanceObj" :sendData="applyData.custBalanceObj" :selectedItem.sync="applyData.custBalanceObj"></sinSelector>
            <x-input title="结算周期" :max="50" type="number" placeholder="请输入" v-model.trim="applyData.custBalanceCycle"></x-input>
        </group>
        <group title='支付方式' label-margin-right="1em">
            <checklist label-position="left" :options="dictionary.payMethod" v-model="payMethod"></checklist>
        </group>
        <group title='合同信息' label-margin-right="1em">
            <x-input title="社会信用代码" :max="50" placeholder="请输入" v-model.trim="contractInfoSaveReq.creditCode"></x-input>
            <x-input title="法定代表人" :max="50" placeholder="请输入" v-model.trim="contractInfoSaveReq.legalRepresentative"></x-input>
            <x-input title="注册地址" :max="50" placeholder="请输入" v-model.trim="contractInfoSaveReq.registeredAddress"></x-input>
            <x-input title="调度费比例(%)" :max="50" placeholder="请输入" type="number" v-model.trim="contractInfoSaveReq.dispatchProportion"></x-input>
        </group>
        <group title='贸易结构' label-margin-right="1em">
            <x-textarea title="上游" placeholder='请输入说明' :max="200" v-model="applyData.custTradeStructureReq.upstream"></x-textarea>
            <x-textarea title="下游" placeholder='请输入说明' :max="200" v-model="applyData.custTradeStructureReq.downstream"></x-textarea>
        </group>
        <group title='联系人信息' label-margin-right="1em" v-for="(item, index) in custLinkman" :key="index">
            <cell disabled @click.native="setLinkman(index)" class="link">
                <span slot="title" class="font-orange">
                    <span style="vertical-align:middle;">设为默认联系人</span>
                </span>
                <x-icon class="linkicon" v-if="item.isContractLinkman == '1'" slot="icon" type="ios-checkmark" size="25"></x-icon>
                <x-icon class="linkicon" v-else slot="icon" type="ios-checkmark-outline" size="25"></x-icon>
                <span class="fr font-orange" @click.stop="openDelDialog(index)">删除</span>
            </cell>
            <x-input title="联系人" :max="50" placeholder="请输入" v-model.trim="item.linkmanName">
                <span slot="label">联系人<span class="required">*</span></span>
            </x-input>
            <x-input title="联系方式" :max="50" type="number" placeholder="请输入" v-model="item.linkmanPhone">
                <span slot="label">联系方式<span class="required">*</span></span>
            </x-input>
            <x-input title="邮箱" :max="50" placeholder="请输入" v-model.trim="item.linkmanMail"></x-input>
            <x-input title="职位" :max="50" placeholder="请输入" v-model.trim="item.linkmanPost">
                <span slot="label">职位<span class="required">*</span></span>
            </x-input>
            <x-textarea title="备注" v-model.trim="item.remarks" placeholder="请输入" :max="200" :rows="3"></x-textarea>
            <!-- <x-input title="备注" :max="200" placeholder="请输入" v-model.trim="item.remarks"></x-input> -->
        </group>
        <div class="add-btn">
            <span class="pointer" @click="addItem">新增联系人</span>
        </div>
        <div v-transfer-dom>
            <confirm v-model="showDelDialog" title="删除该联系人" @on-cancel="showDelDialog = false" @on-confirm="delItem">
                <p style="text-align:center;">{{ ('确定是否删除该联系人?') }}</p>
            </confirm>
        </div>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" :disabled="isSubmit" class="mt-15" @click.native="openSubmit">保存</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <div v-transfer-dom>
            <confirm v-model="isSubmit" title="保存" @on-cancel="isSubmit=false" @on-confirm="submit">
                <p style="text-align:center;">是否保存？</p>
            </confirm>
        </div>
    </div>
</template>
<script>
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import sinSelector from "@/components/sinSelector";
import XHR from "@/assets/js/XHR";
import { mapState, mapGetters } from "vuex";
import {
    XAddress,
    Box,
    Popup,
    Checklist,
    Search,
    Group,
    Cell,
    Radio,
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
import listVue from "../log/list.vue";
export default {
    name: "CustomerApply",
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
        Radio,
        XTextarea,
        Selector,
        Confirm,
        Icon,
        Calendar,
        Flexbox,
        FlexboxItem,
        XAddress,
        XDialog,
        sinSelector
    },

    data: function() {
        return {
            isSubmit: false,
            leaderName: "",
            paramsId: this.$route.params.id,
            showDelDialog: false,
            delDialigIndex: "",
            submitContent: "是否报备",
            custAddressCode: [], //客户注册地址编号
            // areaId: [], //所属区域id
            payMethod: [],
            creditCode:"",
            baseInfo: {
                userName: ""
            },
            checkIndex: [],
            custLinkman: [
                {
                    linkmanName: "", //联系人姓名
                    linkmanPhone: "", //联系人电话
                    linkmanPost: "", //联系人职位
                    remarks: "", //备注
                    isContractLinkman: "0", //合同联系人：0否，1是
                    linkmanMail: "" //邮箱
                }
            ],
            contractInfoSaveReq: {
                oldCreditCode: "",
                creditCode: "",//统一社会信用代码
                dispatchProportion: "5.7",//调度费比例 
                legalRepresentative: "",//法定代表人
                registeredAddress: "",//注册地址
            },
            applyData: {
                custCode: "",
                // areaId: [], //所属区域id
                custAbbreviation: "", //客户简称
                custAddress: "", //客户注册地址
                custAddressCode: [], //客户注册地址编号
                custBalanceCycle: "", //周期（天数）
                custBalanceObj: "", //结算对象：司机，车队 ,
                custBusinessType: "", //业务类型：物流，贸易，物流+贸易 ,
                // custClassify: "", // 客户分类：1000+万吨/月 500~1000万吨/月 0~500万吨/月
                custCompanySize: undefined, //规模（万吨/月）
                custDeliverMode: "", //发货方式：贸易方，物流方，信息部/第三方物流 ,
                custHolderStructure: "", // 股东结构
                custLinkman: [],
                custName: "", //客户名称
                // custNature: "", //公司性质：国企，合资，私企
                custPowerMode: "", //运力组织方式：自有车辆，自行叫车，信息部/第三方物流
                custReceiveMode: "", //收货方式：贸易方，物流方，信息部/第三方物流 ,
                custSource: "", //客户来源
                // custStage: "", //客户阶段：01考察02合作
                custStatus: "", //报备状态
                contractInfoSaveReq: {
                    creditCode: "",//统一社会信用代码
                    dispatchProportion: "5.7",//调度费比例 
                    legalRepresentative: "",//法定代表人
                    registeredAddress: "",//注册地址
                },
                custTradeStructureReq: {
                    downstream: "",
                    upstream: ""
                },
                custTrades: "", //所属行业：煤炭，V渣土，水泥，钢铁
                // custType: "", //客户类别：01企业客户02政府客户99其它
                id: this.$route.params.id, //主键ID
                marketLeaderId: "", //市场负责人ID
                marketLeaderPhone: "", //市场负责人手机号
                oldCustName: "", //修改页面带入客户名称
                onLineTime: "",
                payMethod: [], //支付方式：预付，账期，（可多选）
                remarks: ""
            },
            dictionary: {
                //字典
                // custClassify: [], //客户分类
                // custNature: [], //公司性质
                custTrades: [], //所属行业
                custDeliverMode: [], //发货方式
                custBalanceObj: [],
                payMethod: [], //支付方式
                custBusinessType: [], //业务类型
                custPowerMode: [], //运力组织方式
                custReceiveMode: [], //收货方式
                // custTypeList: [], //客户类别
                // custStageList: [] //客户阶段
            }
        };
    },
    computed: {
        ...mapState({
            addressData: state => state.addressData
        }),
    },
    created() {
        this.init();
        this.getAddressData();
    },
    mounted() {
        this.getDictionary();
    },
    // beforeRouteLeave(to,from,next){
    //     //有BUG ，滑动返回时显示内容会重复
    //     // debugger    
    //     console.log("leave")
    //     this.$vux.confirm.show({   
    //         title: "确定离开？",
    //         // content: "开放客户后，将无法再捡回该客户，是否开放客户？",
    //         onCancel() {
    //             next(false)
    //         },
    //         onConfirm() {
    //             next()
    //         }
    //     });
    // },
    methods: {
        getAddressData() {
            if (this.addressData.length == 0) {
                com.covertHttp(api.areaInfo).then(res => {
                    this.$store.dispatch("setAddressData", res.data);
                });
            }
        },
        getDictionary() {
            com.comGetStorage('queryDict').then(data => { 
                var getData = data.dict 
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
                this.dictionary.custTrades = selectDic(getData, "cust_trades"); //所属行业
                this.dictionary.custDeliverMode = selectDic(getData,"cust_deliver_mode"); //发货方式
                this.dictionary.custBalanceObj = selectDic(getData,"cust_balance_obj"); //发货方式
                this.dictionary.payMethod = selectDic(getData, "pay_method"); //发货方式
                this.dictionary.custBusinessType = selectDic(getData,"cust_business_type"); //发货方式
                this.dictionary.custPowerMode = selectDic(getData,"cust_power_mode"); //运力组织方式
                this.dictionary.custReceiveMode = selectDic(getData,"cust_receive_mode"); //手货方式
            });
        },
        init() {
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = res;
            });
            if (this.$route.params.id == 0) {
            } else {
                // 编辑
                // 处理编辑逻辑
                this.getDetail().then(rtnData => {
                    // 基础参数赋值
                    this.applyData = rtnData;
                    if(rtnData.custTradeStructureResponse){
                        this.applyData.custTradeStructureReq = rtnData.custTradeStructureResponse;
                    } else {
                        this.applyData.custTradeStructureReq = {
                            downstream: "",
                            upstream: ""
                        }
                    }
                    if (rtnData.custLinkmanResponse) this.custLinkman = rtnData.custLinkmanResponse;
                    this.applyData.oldCustName = rtnData.custName;
                    this.contractInfoSaveReq = rtnData.contractInfoDetailResponse;
                    this.contractInfoSaveReq.oldCreditCode = rtnData.contractInfoDetailResponse.creditCode;
                    // if (!rtnData.areaId) {
                    //     this.areaId = [];
                    // } else {
                    //     this.areaId = rtnData.areaId;
                    // }
                    if (!rtnData.custAddressCode) {
                        this.custAddressCode = [];
                    } else {
                        this.custAddressCode = rtnData.custAddressCode;
                    }
                    if (!rtnData.payMethod) {
                        this.payMethod = [];
                    } else {
                        this.payMethod = rtnData.payMethod;
                    }
                });
            }
        },
        getDetail() {
            return new Promise((resolve, reject) => {
                com.covertHttp(api.custInfoDetail, {
                        id: this.paramsId
                    }).then(rtn => {
                        resolve(rtn.data);
                    });
            });
        },
        delItem() {
            if (this.custLinkman.length > 1) {
                this.custLinkman.splice(this.delDialigIndex, 1);
            } else {
                this.$vux.toast.text("无法继续删除");
            }
        },
        addItem() {
            this.custLinkman.push({
                linkmanName: "", //联系人姓名
                linkmanPhone: "", //联系人电话
                linkmanPost: "", //联系人职位
                remarks: "", //备注
                isContractLinkman: "0", //合同联系人：0否，1是
                linkmanMail: "" //邮箱
            });
        },
        setLinkman(index) {
            if (this.custLinkman[index].isContractLinkman == "0") {
                for (let i in this.custLinkman) {
                    if (index == i) {
                        this.custLinkman[i].isContractLinkman = "1";
                    } else {
                        this.custLinkman[i].isContractLinkman = "0";
                    }
                }
            } else {
                this.custLinkman[index].isContractLinkman = "0";
            }
        },
        openDelDialog(index) {
            this.showDelDialog = true;
            this.delDialigIndex = index;
        },
        openSubmit() {
            if(!this.valid()) return
            if (!this.validLinkman()) return;
            this.isSubmit = true;
            // if (this.valid()) {
            //     this.submitContent = "当前客户已满足报备条件，是否进行报备？";
            //     this.applyData.custStatus = 1;
            //     this.isSubmit = true;
            // } else {
            //     this.submitContent = "是否保存？";
            //     this.applyData.custStatus = 0;
            //     this.isSubmit = true;
            // }
        },
        validLinkman() {
            var flag = true;
            for (let i in this.custLinkman) {
                if (this.custLinkman[i].linkmanName == "") {
                    this.$vux.toast.text("请填写联系人");
                    return (flag = false);
                }
                if (this.custLinkman[i].linkmanPhone == "") {
                    this.$vux.toast.text("请填写联系方式");
                    return (flag = false);
                }
                if (!/^1[0-9]{10}$/.test(this.custLinkman[i].linkmanPhone)) {
                    this.$vux.toast.text("联系方式填写有误");
                    return (flag = false);
                }
                if (this.custLinkman[i].linkmanMail && this.custLinkman[i].linkmanMail != "") {
                    if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test( this.custLinkman[i].linkmanMail)) {
                        this.$vux.toast.text("邮箱格式填写有误");
                        return (flag = false);
                    }
                }
                if (this.custLinkman[i].linkmanPost == "") {
                    this.$vux.toast.text("请填写职位");
                    return (flag = false);
                }
            }
            return flag;
        },
        submit() {
            var _this = this;
            this.applyData.custLinkman = this.custLinkman;
            this.applyData.id = this.paramsId;
            this.applyData.custAddressCode = this.custAddressCode;
            this.applyData.payMethod = this.payMethod;
            this.applyData.contractInfoSaveReq = this.contractInfoSaveReq;
            com.covertHttp(api.saveCustInfo, this.applyData).then(rtn => {
                if (rtn.status == 0) {
                    _this.$vux.toast.text(rtn.message || "保存成功");
                    _this.$router.go(-1);
                    com.delKeepAlive(_this,["CustomerCusType"])
                }
            });
        },
        // valid() {
        //     // 整体校验
        //     var flag = true;
        //     if (this.applyData.custAbbreviation == "") return (flag = false);
        //     if (this.applyData.custClassify == "") return (flag = false);
        //     if (this.applyData.custType == "") return (flag = false);
        //     if (this.applyData.custStage == "") return (flag = false);
        //     if (this.areaId.length == 0) return (flag = false);
        //     if (this.applyData.custNature == "") return (flag = false);
        //     if (this.applyData.custHolderStructure == "") return (flag = false);
        //     if (this.applyData.custSource == "") return (flag = false);
        //     if (this.custAddressCode.length == 0) return (flag = false);
        //     if (this.applyData.custAddress == "") return (flag = false);

        //     if (this.applyData.custTrades == "") return (flag = false);
        //     if (this.applyData.custBusinessType == "") return (flag = false);
        //     if (this.applyData.custCompanySize == "") return (flag = false);
        //     if (this.applyData.custPowerMode == "") return (flag = false);
        //     if (this.applyData.custDeliverMode == "") return (flag = false);
        //     if (this.applyData.custReceiveMode == "") return (flag = false);
        //     if (this.applyData.custBalanceObj == "") return (flag = false);
        //     if (this.applyData.custBalanceCycle == "") return (flag = false);

        //     if (this.payMethod.length == 0) return (flag = false);
        //     return flag;
        // },
        valid(){
            var flag = true;
            if (this.applyData.custName == "") {
                this.$vux.toast.text("请填写客户名称");
                flag = true;
                return
            }
            if (this.custAddressCode.length == 0) {
                this.$vux.toast.text("请选择地址");
                flag = true;
                return
            }
            if (this.applyData.custAddress == "") {
                this.$vux.toast.text("请填写详细地址");
                flag = true;
                return
            }
            if (this.applyData.custTrades == "" || this.applyData.custTrades == undefined) {
                this.$vux.toast.text("请选择所属行业");
                flag = true;
                return
            }
            return flag
        },
    }
};
</script>
<style scoped lang="less">
.approval_apply {
    .weui-cells {
        margin-top: 0 !important;
    }
    .vux-no-group-title {
        margin-top: 0 !important;
    }
    .weui-cell__hd {
        width: 25px;
        height: 25px;
    }
    .link {
        .linkicon {
            display: inline-block;
            margin-right: 5px;
            fill: orange;
            margin-bottom: -8px;
        }
    }

}
</style>
<style>
.reddot{
    position: relative;
}
.reddot .vux-label-desc{
    font-size: 17px;
    display: block;
    position: absolute !important;
    top: 11px;
    left: 8px;
    color: red;
}
</style>

