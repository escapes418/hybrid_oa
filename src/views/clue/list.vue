<template>
    <div>
        <div>
            <group>
                <cell-box v-for="(el,index)  in list" :key="index" @click.native="gotoClueDetail(el.id)">
                    <div>
                        <div class="disc-text">
                            <div class="long-content">
                                <span class="disc-title long-title">客户编号</span>
                                <span class="long-text  font-title">{{el.custCode}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">客户名称</span>
                                <span class="long-text">{{el.custName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">所属区域</span>
                                <span class="long-text">{{el.areaName}}</span>
                            </div>
                            <!-- <div class="long-content">
                                <span class="disc-title long-title">市场负责人</span>
                                <span class="long-text">{{el.marketLeaderName }}</span>
                            </div> -->
                            <div class="long-content">
                                <span class="disc-title long-title">创建时间</span>
                                <span class="long-text">{{el.updateTime | stamp2TextDate}}</span>
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <div class="add-btn mb-15" v-if="loadmore">
                <span class="pointer" @click="clickLoadMore()">加载更多</span>
            </div>
            <div class="prompt" v-if="count==0">
                <icon type="info" is-msg class="prompt-icon"></icon>
                <div class="mt-10">暂无数据</div>
            </div>
            <div class="fixed-btn">
                <x-button type="primary" class="smallbtn" :mini="true" @click.native="creatClue">新建</x-button>
                <x-button type="primary" class="smallbtn" :mini="true" @click.native="showSearchBox">筛选</x-button>
            </div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showSearch" position="bottom" max-height="50%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="客户名称" :max="50" v-model.trim="searchOpts.custName" placeholder="请输入客户名称"></x-input>
                    <!-- <x-input title="市场负责人" v-model="searchOpts.marketLeaderName" placeholder="请输入市场负责人"></x-input> -->
                    <datetime format="YYYY-MM-DD" v-model="clueTimeStartObj" class="data-time" title="起始时间" :end-date="todayDate" placeholder="请选择起始时间"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="clueTimeEndObj" class="data-time" title="截止时间" :end-date="todayDate" placeholder="请选择截止时间"></datetime>
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
import Vue from 'vue'
import axios from "@/assets/api/axios";
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import XHR from "@/assets/js/XHR";
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
    name: "ClueList",
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
        Popup,
        Box
    },
    data: function() {
        return {
            results: [],
            list: [],
            count: 0,
            page: 1, //当前页数
            pageTotal: 1,
            pageSize: 10,

            showSearch: false,

            clueTimeStartObj:"",
            clueTimeEndObj:"",
            // 搜索条件
            searchOpts: {
                custName : "", // 申请人姓名
                marketLeaderName : "", // 流程编号
                clueTimeStart: undefined, // 开始时间
                clueTimeEnd: undefined// 结束时间
            },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate: com.timeFormat(new Date().getTime())
        };
    },
    computed: {
        loadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {
        this.init();
        com.addKeepAlive(this) //添加keep-alive
    },
    methods: {
        init() {
            this.page = 1;
            this.reset()
            this.getList();
        },
        getList(opts) {
            var postData = {
                pageNo: 1,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            }; 
            com.covertHttp(api.queryMyClueFlowList,postData).then(rtn => {
                this.list = rtn.data.list;
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
                this.showSearch = false;
            }); 
        },
        //切换tab
        gotoClueDetail(id) {
            this.$router.push({ path: "/clue/form/",query:{ key: id} })
        },
        creatClue(){
            this.$router.push({path:'/clue/form'})
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.queryMyClueFlowList,postData).then(rtn => {
                this.list.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);

            });   
        },
        search() {
            if (this.clueTimeEndObj != "" &&new Date(this.clueTimeEndObj) <new Date(this.clueTimeStartObj)){
                this.$vux.toast.text("结束时间需大于开始时间");
                return;
            }
            this.searchOpts.clueTimeStart = com.timeParse(this.clueTimeStartObj)
            if(!this.clueTimeEndObj){
                this.searchOpts.clueTimeEnd = 0
            }else{
                this.searchOpts.clueTimeEnd = (com.timeParse(this.clueTimeEndObj) + 24*60*60*1000)
            }
            this.axiosOpts = { ...this.searchOpts };
            // 搜索
            this.getList()
            
        },
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        reset() {
            // 重置
            this.page = 1;
            this.axiosOpts = {}
            this.clueTimeEndObj = undefined
            this.clueTimeStartObj = undefined
            this.searchOpts = {
                custName : "",
                marketLeaderName : "",
                clueTimeStart: undefined,
                clueTimeEnd: undefined
            };
        }
    }
};
</script>
<style>
.fixed-btn {
    position: fixed;
    bottom: 40px;
    right: 10px;
}
.smallbtn{
    display: block !important;
}
.font-title{
    color: #00b300
}
</style>



