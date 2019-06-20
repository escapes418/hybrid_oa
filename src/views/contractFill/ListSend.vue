<template>
    <div>
        <!-- <tab v-model="tabIndex" @on-before-index-change="switchTabItem">
            <tab-item selected>进行中</tab-item>
            <tab-item>已完成</tab-item>
        </tab> -->
        <group v-if="count!==0" title='合同归档列表'>
            <cell-box v-for="(el,index) in mysendList" :key="index" @click.native="gotoDetail(el.id)">
                <div class="w-100">
                    <div class="disc-text">
                        
                        <div class="content-title">
                            <span>合同负责人 - {{el.contractLeaderName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">合同名称</span>
                            <span class="long-text">{{el.contractName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">合同编号</span>
                            <span class="long-text">{{el.contractCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">甲方名称</span>
                            <span class="long-text">{{el.firstMemberName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">乙方名称</span>
                            <span class="long-text">{{el.secondMemberName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">丙方名称</span>
                            <span class="long-text">{{el.thirdMemberName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">合同状态</span>
                            <span class="long-text">{{el.contractHisStatusName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">过期时间</span>
                            <span class="long-text">{{el.contractEndTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">回执状态</span>
                            <span class="long-text font-orange">{{el.receiptStatusName}}</span>
                        </div>
                        <!-- <div class="long-content">
                            <span class="disc-title long-title">备注</span>
                            <span class="long-text">{{el.remarks}}</span>
                        </div> -->
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="fixed-btn">
            <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
        </div>
        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div>

        <div class="prompt" v-if="count===0">
            <icon type="info" is-msg class="prompt-icon"></icon>
            <div class="mt-10">暂无数据</div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showSearch" position="bottom" max-height="70%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="编号/合同方名称" :max="50" v-model.trim="searchOpts.faint" placeholder="请输入合同编号/合同方名称"></x-input>
                    <x-input title="合同负责人" :max="50" v-model.trim="searchOpts.contractLeaderName" placeholder="请输入合同负责人"></x-input>
                    <!-- <x-input title="部门名称" :max="50" v-model.trim="searchOpts.officeName" placeholder="请输入部门名称"></x-input> -->
                    <!-- <x-input title="合同方名称" :max="50" v-model.trim="searchOpts.contractPartyName" placeholder="请输入合同方名称"></x-input> -->
                    <sinSelector sTitle='合同状态' sPlaceholder='请选择' :dataList="dict.contractHisStatus" :sendData="searchOpts.contractHisStatus" :selectedItem.sync="searchOpts.contractHisStatus"></sinSelector>
                    <!-- <sinSelector sTitle='合同类型' sPlaceholder='请选择' :dataList="dict.contractType" :sendData="searchOpts.contractType" :selectedItem.sync="searchOpts.contractType"></sinSelector> -->
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.startTime" class="data-time" title="过期开始时间" placeholder="请选择合同过期开始时间"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.endTime" class="data-time" title="过期结束时间" placeholder="请选择合同过期结束时间"></datetime>
                </group>
                <box gap="10px 10px">
                    <flexbox>
                        <flexbox-item>
                            <x-button type="default" @click.native="reset">重置</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="primary" @click.native="search">搜索</x-button>
                        </flexbox-item>
                    </flexbox>
                </box>
            </popup>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import XHR from "@/assets/js/XHR";
import sinSelector from "@/components/sinSelector";
import {
    Tab,
    TabItem,
    Group,
    Cell,
    CellBox,
    Icon,
    XInput,
    Datetime,
    XButton,
    Popup,
    Box,
    Flexbox,
    FlexboxItem,
    TransferDomDirective as TransferDom
} from "vux";

export default {
    name: "ContractfillListSend",
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
        XInput,
        Datetime,
        XButton,
        Flexbox,
        FlexboxItem,
        sinSelector,
        Popup,
        Box
    },
    data() {
        return {
            tabIndex: 0,
            mysendList: [],
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            // 搜索条件
            showSearch: false,
            searchOpts: {
                contractLeaderName: "", // 申请人姓名
                contractHisStatus: "",
                // contractType: "",
                faint: "",
                dateType: "2",
                // officeName: "", // 部门名称
                startTime: "", // 开始时间
                endTime: "", // 结束时间
                // officeId: "",
                // contractPartyName: "",
            },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate:com.timeFormat(new Date().getTime()),
            dict:{
                // contract_his_status
                contractHisStatus:[],
                contractType: [],
            }
        };
    },
    created() {
        this.getMysendList(this.expenseStatus);
        com.addKeepAlive(this); //添加keep-alive
        this.getDictionary()
    },
    watch: {
        expenseStatus(newVal, val) {
            // 切换时重新从第一页开始获取数据
            if (newVal == val) return;
            this.page = 1;
            this.getMysendList(this.expenseStatus);
        }
    },
    computed: {
        expenseStatus() {
            if (this.tabIndex == 0) {
                return 2; // 进行中
            }
            if (this.tabIndex == 1) {
                return 1; // 已完成
            }
            if (this.tabIndex == 2) {
                return 4; // 草稿箱
            }
        },
        loadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        getDictionary(){
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
                this.dict.contractHisStatus = selectDic("contract_his_status");
                this.dict.contractType = selectDic("contract_type_s");   
                   
            });
        },
        // 获取数据
        getMysendList(type, opts) {
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            // console.log(this.searchOpts.startTime)
            com.covertHttp(api.contractHisList, {
                ...postData,
                startTime:com.timeParse(this.searchOpts.startTime),
                endTime:this.searchOpts.endTime?com.timeParse(this.searchOpts.endTime)+86400000:0,
                // contractFlowStatus: type
                sqlFlag:"1"
            }).then(rtn => {
                // console.log('sdsds',rtn);
                this.mysendList = rtn.data.list;
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        //加载更多
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                // ...postData,
                pageNo: this.page,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.contractHisList, {
                ...postData,
                startTime:com.timeParse(this.searchOpts.startTime),
                endTime:this.searchOpts.endTime?com.timeParse(this.searchOpts.endTime)+86400000:0,
                // contractFlowStatus: this.expenseStatus
                sqlFlag:"1"
            }).then(rtn => {
                this.mysendList.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        switchTabItem(index) {
            this.reset();
            this.getMysendList(this.expenseStatus);
        },
        // 跳转
        gotoDetail(id) {
            if (id == "") return;
            this.$router.push({ path: "/contractFill/detail/" + id + "/myself/0" });
        },
        search() {
            // 搜索
            if(this.searchOpts.endTime != '' && new Date(this.searchOpts.endTime) < new Date(this.searchOpts.startTime)) {
                this.$vux.toast.text("结束时间需大于开始时间");
                return;
            }
            this.axiosOpts = { ...this.searchOpts };
            this.page = 1;
            this.getMysendList(this.expenseStatus);
        },
        reset() {
            // 重置搜索
            this.page = 1;
            this.axiosOpts = {};
            this.searchOpts = {
                contractLeaderName: "",
                faint: "",
                contractHisStatus: "",
                dateType: "2",
                startTime: "",
                endTime: "",
                // officeId: "",
                // contractPartyName: "",
            };
        }
    }
};
</script>
<style>
.fixed-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
</style>

