<template>
    <div v-if="isReady" class="approval_detail">
        <group title='基本信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">客户编号</span>
                            <span class="long-detail">{{dataArr.detail.custCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">客户名称</span>
                            <span class="long-detail font-orange">{{dataArr.detail.custName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">主客户名称</span>
                            <span class="long-detail">{{dataArr.detail.mainCustName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">客户简称</span>
                            <span class="long-detail">{{dataArr.detail.custAbbreviation}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">所属区域</span>
                            <span class="long-detail">{{dataArr.detail.custOfficeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">客户来源</span>
                            <span class="long-detail">{{dataArr.detail.custSource}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">地址</span>
                            <span class="long-detail">{{dataArr.detail.custAddressCodeName}} {{dataArr.detail.custAddress}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='业务情况'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">所属行业</span>
                            <span class="long-detail">{{dataArr.detail.custTradesAppName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">业务类型</span>
                            <span class="long-detail">{{dataArr.detail.custBusinessTypeAppName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">规模(万元/月)</span>
                            <span class="long-detail">{{dataArr.detail.custCompanySize}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">运力组织方式</span>
                            <span class="long-detail">{{dataArr.detail.custPowerModeAppName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">发货方式</span>
                            <span class="long-detail">{{dataArr.detail.custDeliverModeAppName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">收货方式</span>
                            <span class="long-detail">{{dataArr.detail.custReceiveModeAppName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">结算对象</span>
                            <span class="long-detail">{{dataArr.detail.custBalanceObjAppName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">结算周期</span>
                            <span class="long-detail">{{dataArr.detail.custBalanceCycle}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">支付方式</span>
                            <span class="long-detail">{{dataArr.detail.payMethodName}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='合同信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">社会信用代码</span>
                            <span class="long-detail">{{dataArr.detail.contractInfoDetailResponse.creditCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">法定代表人</span>
                            <span class="long-detail font-orange">{{dataArr.detail.contractInfoDetailResponse.legalRepresentative}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">注册地址</span>
                            <span class="long-detail">{{dataArr.detail.contractInfoDetailResponse.registeredAddress}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">调度费比例</span>
                            <span class="long-detail">{{dataArr.detail.contractInfoDetailResponse.dispatchProportion}}
                                <span v-if="dataArr.detail.contractInfoDetailResponse.dispatchProportion">%</span>
                            </span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='贸易结构'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">上游</span>
                            <span class="long-detail">{{dataArr.detail.custTradeStructureResponse.upstream}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">下游</span>
                            <span class="long-detail">{{dataArr.detail.custTradeStructureResponse.downstream}}</span>
                        </div>

                    </div>
                </div>
            </cell-box>
        </group>
        <group v-for="(el,idx) in dataArr.detail.custLinkmanResponse" :key="idx" title='联系人信息' label-margin-right="1em">
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">合同联系人</span>
                            <span class="long-detail" v-if="el.isContractLinkman == 0">否</span>
                            <span class="long-detail" v-if="el.isContractLinkman == 1">是</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">联系人</span>
                            <span class="long-detail">{{el.linkmanName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">邮箱</span>
                            <span class="long-detail">{{el.linkmanMail}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">职位</span>
                            <span class="long-detail">{{el.linkmanPost}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{el.remarks}}</span>
                        </div>
                    </div>
                </div>

            </cell-box>
        </group>

        <group title='维护内容' v-if="DetailList.length != 0" style="margin-bottom:60px">
            <cell-box v-for="(el,index)  in DetailList" :key="index" class="maintainbox">
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">维护时间</span>
                            <span class="long-detail">{{el.custMaintenanceDate|stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">维护人</span>
                            <span class="long-detail">{{el.custMaintenanceMan}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">维护人部门</span>
                            <span class="long-detail">{{el.maintainerDeptName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">客户级别</span>
                            <span class="long-detail">{{el.custStageName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">联系人</span>
                            <span class="long-detail">{{el.linkmanName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">拜访类型</span>
                            <span class="long-detail">{{el.visitTypeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">问题归类</span>
                            <span class="long-detail">{{el.issuesClassification}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">维护内容</span>
                            <span class="long-detail">{{el.custMaintenanceContent}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{el.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
            <div class="add-btn" v-if="loadmore" style="margin-bottom:20px">
                <span class="pointer" @click="clickLoadMore()">加载更多</span>
            </div>
        </group>

        <box class="fixbtn">
            <template>
                <flexbox v-if="type == 1|| type == 2">
                    <flexbox-item>
                        <x-button type="primary" :disabled="ISPICKUP||disPickupCus" @click.native="pickupCus">捡入</x-button>
                    </flexbox-item>
                </flexbox>
                <flexbox v-if="type == 4|| type == 5">
                    <flexbox-item>
                        <x-button type="default" @click.native="openCustomer" :disabled="CANOPEN||disOpenCustomer">开放客户</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
        </box>
    </div>
</template>
<script>
import Vue from "vue";
import com from "@/assets/js/common";
import api from "@/assets/api/index.api";
import XHR from "@/assets/js/XHR";
import {
    Box,
    Confirm,
    Group,
    XButton,
    Timeline,
    Selector,
    TimelineItem,
    Cell,
    ConfirmPlugin,
    CellBox,
    XTextarea,
    XInput,
    XDialog,
    Flexbox,
    FlexboxItem,
    TransferDomDirective as TransferDom
} from "vux";
Vue.use(ConfirmPlugin);
export default {
    name: "ApprovalDetail",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Confirm,
        Group,
        Selector,
        XButton,
        Timeline,
        TimelineItem,
        Cell,
        CellBox,
        XTextarea,
        XInput,
        XDialog,
        Flexbox,
        FlexboxItem
    },
    computed: {
        ISEDIT: function() {
            let result = this.dataArr.detail.modify == "modify" ? true : false;
            return result;
        },
        ISPICKUP() {
            if (this.cusNum < this.custMaxCount && this.baseInfo.phone != this.dataArr.detail.letGoManMoble) {
                return false;
            } else {
                return true;
            }
        },
        CANOPEN() {
            if (this.type == 5) {
                return true;
            } else {
                return false;
            }
        },
        loadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        },

    },
    data() {
        return {
            isReady: false,
            type: "",
            remarkForm: {
                isRemarks: false,
                remarks: "",
                flag: "yes" //yes同意 no拒绝
            },
            baseInfo:{},
            DetailList: [],
            receptionistVal: "",
            cusNum: "",
            dataArr: {},
            optMap2: ["key", "value"],
            approvalType: [
                { key: "1", value: "常规报销" },
                { key: "2", value: "接待报销" }
            ],
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            custMaxCount:30,
            disPickupCus: false,
            disOpenCustomer: false,
        };
    },
    created() {
        this.init();
        this.getMaintain();
        this.getCusNum();
        this.getDictionary();
    },
    methods: {
        init() {
            var params = this.$route.params;
            com.comGetStorage('userInfo').then(res => {
                this.baseInfo = Object.assign({}, this.baseInfo, res);
            });
            if (params.id) {
                this.type = params.type;
                com.covertHttp(api.custInfoDetail, {
                        id: params.id
                    }).then(rtn => {
                        if (rtn.status != 0) {
                            // this.$vux.toast.text(rtn.message) ||
                            //     "查询不到当前信息";
                            return;
                        }
                        this.dataArr.detail = rtn.data;
                        if(rtn.data.custTradeStructureResponse){
                            this.dataArr.detail.custTradeStructureResponse = rtn.data.custTradeStructureResponse;
                        } else {
                            this.dataArr.detail.custTradeStructureResponse = {
                                downstream: "",
                                upstream: ""
                            }
                        }
                        this.isReady = true;
                    });
            } else {
                console.log("参数异常");
                console.log(params);
                this.$router.push({ path: "/userIndex" });
            }
        },
        getDictionary() {
            com.comGetStorage('queryDict').then(data => {
                var getData = data.dict
                getData.forEach((item,index)=>{
                    if(item.type == "cust_max_count"){
                        this.custMaxCount = item.name
                    }
                })
            });
        },
        getCusNum() {
            com.covertHttp(api.custInfoListNum, {
                conflictName: ""
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.cusNum = rtn.data.ownNum;
                } else {
                    // this.$vux.toast.text(rtn.message || "服务器异常");
                    return;
                }
            });
        },
        getMaintain() {
            com.covertHttp(api.custMaintenanceList, {
                custId: this.$route.params.id,
                pageNo: this.page,
                pageSize: this.pageSize
            }).then(rtn => {
                // 基础参数赋值
                this.DetailList = rtn.data.list;
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        clickLoadMore() {
            this.page = this.page + 1;
            com.covertHttp(api.custMaintenanceList, {
                custId: this.$route.params.id,
                pageNo: this.page,
                pageSize: this.pageSize
            }).then(rtn => {
                this.DetailList.push(...rtn.data.list);
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        editApply() {
            // 编辑
            var id = this.$route.params.id;
            if (id == "") return;
            this.$router.push({ path: `/customer/apply/${id}` });
        },
        openCustomer() {
            var _this = this;
            this.disOpenCustomer = true;
            this.$vux.confirm.show({
                // 组件除show外的属性
                title: "开放客户",
                content: "开放客户后，将无法再捡回该客户，是否开放客户？",
                onCancel() {
                    _this.disOpenCustomer = false;
                },
                onConfirm() {
                    _this.changeCus(1);
                }
            });
        },
        pickupCus() {
            var _this = this;
            this.disPickupCus = true
            this.$vux.confirm.show({
                // 组件除show外的属性
                title: "捡入客户",
                content: "是否捡入客户？",
                onCancel() {
                    _this.disPickupCus = false
                },
                onConfirm() {
                    _this.changeCus(2);
                }
            });
        },
        changeCus(type) {
            var _this = this;
            com.covertHttp(api.custChangePick, {
                id: this.$route.params.id,
                isChange: type
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.$router.go(-1);
                    this.$vux.toast.text(rtn.message || "操作成功");
                    com.delKeepAlive(_this,["CustomerCusType"])
                    this.disPickupCus = false
                    this.disOpenCustomer = false;
                }
                this.disPickupCus = false
                this.disOpenCustomer = false;
            });
        },
    }
};
</script>
<style lang="less">
.approval_detail {
    .upload-img {
        width: 100px;
        height: 80px;
        padding: 0 120px 10px;
    }
    .upload-img img {
        width: 100%;
        height: 100%;
    }
}
.xdialog-group-textarea {
    .weui-textarea {
        text-align: left !important;
    }
}

.mlong-text {
    float: left;
    margin-left: 6.5em;
}

.mdisc-title {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    color: #99a9bf;
    width: 6.5em;
    text-align: justify;
    text-align-last: justify;
}
.mlong-text {
    float: left;
    margin-left: 7.5em;
}
.fixbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 100;
    background: #f0f0f2;
}
</style>
