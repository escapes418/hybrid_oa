<template>
    <div>
        <tab v-model="tabIndex" prevent-default @on-before-index-change="switchTabItem">
            <tab-item selected>收单员异常单</tab-item>
            <tab-item>管理员异常单</tab-item>
        </tab>
        <group label-margin-right="1em">
            <cell-box v-for="(el,index)  in dataList" :key="index" @click.native="gotoDetail(el)">
                <div>
                    <div class="disc-text">
                        <div class="long-content">
                            <span class="disc-title long-title">运单号</span>
                            <span class="long-text font-orange">{{el.orderNumber}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">车牌</span>
                            <span class="long-text">{{el.vehicleNumber}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">装货地址名</span>
                            <span class="long-text">{{el.loadAddressName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">装货时间</span>
                            <span class="long-text">{{el.loadTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">卸货地址名</span>
                            <span class="long-text">{{el.unloadAddressName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">卸货时间</span>
                            <span class="long-text">{{el.unloadTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">异常时间</span>
                            <span class="long-text">{{el.abnormalTime | stamp2TextDateFull}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="fixed-btn">
            <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
        </div>
        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">加载更多</span>
        </div>
        <div class="prompt" v-if="count==0">
            <icon type="info" is-msg class="prompt-icon"></icon>
            <div class="mt-10">暂无数据</div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showSearch" position="bottom" max-height="70%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="运单号/车牌号" :max="50" v-model.trim="searchOpts.queryKey" placeholder="请输入运单号/车牌号"></x-input>
                    <sinSelector sTitle='装货地址' sPlaceholder='请选择' :dataList="loadList" :sendData="searchOpts.loadAddressCode" :selectedItem.sync="searchOpts.loadAddressCode"></sinSelector>
                    <sinSelector sTitle='卸货地址' sPlaceholder='请选择' :dataList="loadList" :sendData="searchOpts.unloadAddressCode" :selectedItem.sync="searchOpts.unloadAddressCode"></sinSelector>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.loadTimeStart" class="data-time" title="装货时间" placeholder="请选择开始时间"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.unloadTimeStart" class="data-time" title="卸货时间" placeholder="请选择开始时间"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.abnormalTimeStart" class="data-time" title="异常时间" placeholder="请选择开始时间"></datetime>
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
    name: "excList",
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
    data: function() {
        return {
            tabIndex:0,
            dataList: [],
            count: -1,
            page: 1, 
            pageTotal: 1,
            pageSize: 10,

            showSearch: false,
            // 搜索条件
            searchOpts: {
                queryKey: "", // 运单号/车牌号
                loadAddressCode:"",//装货地址
                unloadAddressCode:"",//卸货地址
                loadTimeStart:"",//装货时间
                unloadTimeStart:"",//卸货时间
                abnormalTimeStart:"",//异常时间
            },
            companyCode: this.$route.params.id,
            axiosOpts: {},
            loadList: [],
            unloadList: [],
        };
    },
    created() {
        this.init();
        this.getLoad();
    },
    computed: {
        loadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        },
    },
    watch: {

    },
    methods: {
        init() {
            this.page = 1;
            this.reset();
            this.getList();
        },
        getLoad() {
            com.covertHttp(api.queryCommonLoadAddress, {
                code: this.companyCode
            }).then(rtn => {
                if(rtn.data.addresss){
                    rtn.data.addresss.forEach((item,index)=>{
                        this.loadList.push({
                            key: item.addressCode,
                            value: item.addressName,
                        })
                    })
                }
                
            });
        },
        distinct(list, type) {// 数组添加 key value 并去重
            var arr = [];
            var result = [];
            list.forEach((item, index) => {
                if(item.addressType == type){
                    arr.push({
                        key: item.addressCode,
                        value: item.addressName,
                    });
                }
            });
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    if (arr[i].key === arr[j].key) {
                        j = ++i;
                    }
                }
                result.push(arr[i]);
            }
            return result
        },
        getList(opts) {
            var postData = {
                start: 0,
                limit: this.pageSize,
                companyCode: this.companyCode,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(this.tabIndex==0?api.abnormalOrderListForOA:api.stockOrderErrorListForOA, {
                ...postData,
                loadTimeStart:com.timeParse(this.searchOpts.loadTimeStart),
                unloadTimeStart:com.timeParse(this.searchOpts.unloadTimeStart),
                abnormalTimeStart:com.timeParse(this.searchOpts.abnormalTimeStart),
            }).then(rtn => {
                if(rtn.status == 0){
                    this.dataList = rtn.data.list;
                    this.count = parseInt(rtn.data.total) || 0;
                    this.pageTotal = Math.ceil(this.count / this.pageSize);
                    this.showSearch = false;
                } else {
                this.count = 0;
                }
                
            });
        },
        switchTabItem(index) {
            this.tabIndex = index
            this.reset()
            this.getList()
        },
        search() {
            this.axiosOpts = { ...this.searchOpts };
            this.getList();
        },
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                start: parseInt(this.page - 1),
                limit: this.pageSize,
                companyCode: this.companyCode,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(this.tabIndex==0?api.abnormalOrderListForOA:api.stockOrderErrorListForOA, {
                ...postData,
                loadTimeStart:com.timeParse(this.searchOpts.loadTimeStart),
                unloadTimeStart:com.timeParse(this.searchOpts.unloadTimeStart),
                abnormalTimeStart:com.timeParse(this.searchOpts.abnormalTimeStart),
            }).then(rtn => {
                if(rtn.status == 0){
                    this.dataList.push(...rtn.data.list);
                    this.count = parseInt(rtn.data.total) || 0;
                    this.pageTotal = Math.ceil(this.count / this.pageSize);
                } else {
                    this.count = 0;
                }
            });
        },
        async gotoDetail(el) {
            await com.comSetStorage('excListDetail', el);
            this.$router.push({
                path: "/excTicket/detail"
            });
        },
        reset() {
            // 重置搜索
            this.page = 1;
            this.axiosOpts = {};
            this.searchOpts = {
                queryKey: "",
                loadAddressCode:"",
                unloadAddressCode:"",
                loadTimeStart:"",
                unloadTimeStart:"",
                abnormalTimeStart:"",
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


