<template>
    <div>
        <tab v-model="tabIndex" prevent-default @on-before-index-change="switchTabItem">
            <tab-item>我的日志</tab-item>
            <tab-item>看日志</tab-item>
        </tab>
        <group v-if="count!==0">
            <cell-box v-for="(el,index) in listData" :key="index" @click.native="gotoDetail(el)">
                <div class="w-100">
                    <div class="disc-text">
                        <div class="content-title">{{el.createByName}}
                            <span v-if="el.dailyTemplate == 0">发起的实施工作日志</span>
                            <span v-if="el.dailyTemplate == 1">发起的市场工作日志</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">部门</span>
                            <span class="long-text">{{el.dailyOfficeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">日志模板</span>
                            <span class="long-text">{{el.dailyTemplateName}}</span>
                        </div>
                        <div class="long-content" v-if="tabIndex == 1">
                            <span class="disc-title long-title">状态</span>
                            <span class="long-text" v-if="el.readStatus == 0">已读</span>
                            <span class="long-text font-red" v-if="el.readStatus == 1">未读</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">提交时间</span>
                            <span class="long-text">{{el.createTime | stamp2TextDateFull}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="fixed-btn">
            <x-button type="primary" class="smallbtn" :mini="true" @click.native="showApply=true">新建</x-button>
            <x-button type="primary" class="smallbtn" :mini="true" @click.native="showSearchBox">筛选</x-button>
        </div>
        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div>

        <div class="prompt" v-if="count===0">
            <icon type="info" is-msg class="prompt-icon"></icon>
            <div class="mt-10">暂无数据</div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showApply" position="bottom" max-height="70%">
                <cell title="市场部工作日志" @click.native="goApply(1)" is-link></cell>
                <cell title="实施部工作日志" @click.native="goApply(2)" is-link></cell>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showSearch" position="bottom" max-height="70%">
                <group gutter="20px" label-margin-right="1em">
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.startTime" class="data-time" title="开始时间" :end-date="todayDate" placeholder="请选择"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.endTime" class="data-time" title="结束时间" :end-date="todayDate" placeholder="请选择"></datetime>
                    <x-input title="提交人" v-if="tabIndex == 1" v-model="searchOpts.fant" placeholder="请输入"></x-input>
                    <sinSelector sTitle='状态' v-if="tabIndex == 1" sPlaceholder='请选择' :dataList="dictionary.readStatus" :sendData="searchOpts.readStatus" :selectedItem.sync="searchOpts.readStatus"></sinSelector>
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
import { mapState } from 'vuex'
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
    name: "logList",
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
            tabIndex:  0,
            listData: [],
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            // 搜索条件
            showSearch: false,
            showApply: false,
            searchOpts: {
                fant: "", // 申请人姓名
                startTime: "", // 开始时间
                endTime: "", // 结束时间
                readStatus:"",
            },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate:com.timeFormat(new Date().getTime()),
            dictionary: {
                readStatus: [],
            },
        };
    },
    created() {
        this.tabIndex = this.logListTabIndex
        this.getList();
        this.getDictionary(); 
    },
    watch: {

    },
    computed: {
        ...mapState({
            logListTabIndex: state => state.logListTabIndex,
        }),
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
                this.dictionary.readStatus = selectDic("read_status"); //紧急度       
            });
        },
        // 获取数据
        getList(opts) {
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.logFindPage, {
                ...postData,
                startTime:com.timeParse(this.searchOpts.startTime),
                endTime:this.searchOpts.endTime?com.timeParse(this.searchOpts.endTime)+86400000:0,
                queryType: this.tabIndex+1,
            }).then(rtn => {
                this.listData = rtn.data.list;
                // 重新计算总页数
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
            com.covertHttp(api.logFindPage, {
                ...postData,
                startTime:com.timeParse(this.searchOpts.startTime),
                endTime:this.searchOpts.endTime?com.timeParse(this.searchOpts.endTime)+86400000:0,
                queryType: this.tabIndex+1,
            }).then(rtn => {
                this.listData.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        switchTabItem(index) {
            this.tabIndex = index
            this.$store.dispatch('setLogListTabIndex', index)
            this.reset();
            this.getList()
        },
        // 跳转
        gotoDetail(el) {
            if (el.dailyId == "") return;
            if(el.dailyTemplate == 1){
                this.$router.push({ path: "/log/marketDetail/" + el.dailyId});
            } else if(el.dailyTemplate == 0) {
                this.$router.push({ path: "/log/impDetail/" + el.dailyId});
            }
            
        },
        goApply(type){
            if (type == 1) {
                this.$router.push({ path: "/log/marketApply"});
            } else if(type == 2) {
                this.$router.push({ path: "/log/impApply"});
            }
            
        },
        search() {
            // 搜索
            if(this.searchOpts.endTime != '' && new Date(this.searchOpts.endTime) < new Date(this.searchOpts.startTime)) {
                this.$vux.toast.text("结束时间需大于开始时间");
                return;
            }
            this.axiosOpts = { ...this.searchOpts };
            this.page = 1;
            this.getList();
        },
        reset() {
            // 重置搜索
            this.page = 1;
            this.axiosOpts = {};
            this.searchOpts = {
                fant: "",
                startTime: "",
                endTime: "",
                readStatus:"",
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
.fixed-btn .smallbtn{
    display: block !important;
}
</style>

