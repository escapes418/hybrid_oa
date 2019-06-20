<template>
    <div>
        <!-- <tab v-model="tabIndex" @on-before-index-change="switchTabItem">
            <tab-item selected>进行中</tab-item>
            <tab-item>已完成</tab-item>
        </tab> -->
        <group v-if="count!==0" title='历史负责人' label-margin-right="1em">
            <cell-box v-for="(el,index) in listData" :key="index">
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">历史负责人</span>
                            <span class="long-detail">{{el.name}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">开始负责时间</span>
                            <span class="long-detail">{{el.startTime | stamp2TextDateFull}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <!-- <div class="fixed-btn">
            <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
        </div> -->
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
                    <x-input title="姓名" :max="50" v-model.trim="searchOpts.applyPerName" placeholder="请输入申请人姓名"></x-input>
                    <x-input title="流程/合同编号" :max="50" v-model.trim="searchOpts.queryText" placeholder="请输入流程/合同编号"></x-input>
                    <x-input title="部门名称" :max="50" v-model.trim="searchOpts.officeName" placeholder="请输入部门名称"></x-input>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.applyTimeStart" class="data-time" title="开始时间" :end-date="todayDate" placeholder="请选择申请开始时间"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.applyTimeEnd" class="data-time" title="结束时间" :end-date="todayDate" placeholder="请选择申请结束时间"></datetime>
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
    name: "CoopHisPrincipal",
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
            listData: [],
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            showSearch: false,
            searchOpts: {
                applyPerName: "", // 申请人姓名
                queryText: "",
                officeName: "", // 部门名称
                applyTimeStart: "", // 开始时间
                applyTimeEnd: "", // 结束时间
                officeId: ""
            },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate:com.timeFormat(new Date().getTime()),
        };
    },
    created() {
        this.getList();
    },
    watch: {
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
    methods: {
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        // 获取数据
        getList(opts) {
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.queryHisPrincipal, {
                ...postData,
                needFlowId: this.$route.params.id,
            }).then(rtn => {
                this.listData = rtn.data.list;
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        //加载更多
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.queryHisPrincipal, {
                ...postData,
                needFlowId: this.$route.params.id,
            }).then(rtn => {
                this.listData.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        switchTabItem(index) {
            this.tabIndex = index
            this.reset();
            this.getList();
        },
        search() {
            this.axiosOpts = { ...this.searchOpts };
            this.getList();
        },
        reset() {
            // 重置搜索
            this.page = 1;
            this.axiosOpts = {};
            this.searchOpts = {
                applyPerName: "",
                queryText: "",
                officeName: "",
                applyTimeStart: "",
                applyTimeEnd: "",
                officeId: ""
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

