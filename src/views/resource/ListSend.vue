<template>
    <div>
        <tab v-model="tabIndex">
            <tab-item selected>进行中</tab-item>
            <tab-item>已完成</tab-item>
            <tab-item>草稿箱</tab-item>
        </tab>
        <group v-if="count!==0">
            <cell-box v-for="(el,index) in mysendList" :key="index" @click.native="gotoApprovalDetail(el.id)">
                <div class="w-100">
                    <div class="content-title">{{el.applyPerName}}
                        <span>发起的资源申请</span>
                    </div>
                    <div class="disc-text">
                        <div class="long-content">
                            <span class="disc-title long-title">流程编号</span>
                            <span class="long-text">{{el.procCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">申请时间</span>
                            <span class="long-text">{{el.createDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">费用总额</span>
                            <span class="long-text">{{el.amountSum||0 | thousands(2) }}元</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">当前状态</span>
                            <span class="long-text font-orange">{{el.expenseStatusValue}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">备注</span>
                            <span class="long-text">{{el.remarks}}</span>
                        </div>
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
            <popup v-model="showSearch" position="bottom" max-height="50%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="姓名" :max="50" v-model.trim="searchOpts.applyName" placeholder="请输入申请人姓名"></x-input>
                    <x-input title="流程编号" :max="50" v-model.trim="searchOpts.procCode" placeholder="请输入流程编号"></x-input>
                    <!-- <x-input title="部门名称" v-model="searchOpts.officeName" placeholder="请输入部门名称"></x-input> -->
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
import Vue from 'vue'
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'
import XHR from '@/assets/js/XHR';
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput, Datetime,XButton,Popup,Box,Flexbox, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';

export default {
    name: "ResourceListSend",
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
        Box,
    },
    data() {
        return {
            tabIndex: 0,
            mysendList: [],
            count: -1,
            page: 1,//当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            showSearch:false,
            searchOpts:{
                applyName:'', // 申请人姓名
                procCode:'',
                officeName:'', // 部门名称
                applyTimeStart:'', // 开始时间
                applyTimeEnd:'', // 结束时间
                officeId:'',
            },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate:com.timeFormat(new Date().getTime()),
        }
    },
    created() {
        this.getMysendList();
        com.addKeepAlive(this) //添加keep-alive
    },
    watch: {
        resourcesApplyStatus (newVal, val) {
            // 切换时重新从第一页开始获取数据
            if (newVal == val) return;
            this.page = 1;
            this.getMysendList(this.page, this.resourcesApplyStatus);
        }
    },
    computed: {
        resourcesApplyStatus() {
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
        // 获取数据
        getMysendList(opts) {
            var postData = {
                pageNo:1,
                pageSize:this.pageSize,
                resourcesApplyStatus:this.resourcesApplyStatus,
                ...this.axiosOpts,
                ...opts
            }
            com.covertHttp(api.MyResourcesApplyFlowList,{
                ...postData,
                applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
                applyTimeEnd:com.timeParse(this.searchOpts.applyTimeEnd),
            }).then(rtn => {
                // console.log('sdsds',rtn);
                this.mysendList = rtn.data.list;
                    // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        //加载更多
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo:this.page,
                pageSize:this.pageSize,
                resourcesApplyStatus: this.resourcesApplyStatus,
                ...this.axiosOpts,
                ...opts
            }
            com.covertHttp(api.MyResourcesApplyFlowList,{
                ...postData,
                applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
                applyTimeEnd:com.timeParse(this.searchOpts.applyTimeEnd),
            }).then(rtn => {
                this.mysendList.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        search() { // 搜索
            if(this.searchOpts.applyTimeEnd != '' && new Date(this.searchOpts.applyTimeEnd) < new Date(this.searchOpts.applyTimeStart)) {
                this.$vux.toast.text("结束时间需大于开始时间");
                return;
            }
            this.axiosOpts = { ...this.searchOpts };
            this.getMysendList();
        },
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        // 跳转
        gotoApprovalDetail(id) {
            if (id == "") return
            this.$router.push({ path: "/resource/detail/" + id + "/myself/0" });
        },
        reset() { // 重置搜索
            this.page = 1;
            this.axiosOpts = {}
            this.searchOpts = {
                applyName:'',
                procCode:'',
                officeName:'',
                applyTimeStart:'',
                applyTimeEnd:'',
                officeId:'',
            }
        }
    }
}
</script>
<style>
.fixed-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
.weui-cells {
  /* margin-top: 10px !important; */
}
</style>

