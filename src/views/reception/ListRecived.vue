<template>
    <div>
        <tab v-model="apprState" prevent-default @on-before-index-change="switchTabItem">
            <tab-item selected>我未审批</tab-item>
            <tab-item>我已审批</tab-item>
        </tab>
        <div v-if="apprState==0">
            <!-- 我未审批 -->
            <group>
                <cell-box v-for="(el,index)  in noApprList" :key="index" @click.native="gotoApprovalDetail(el.businessId,'todo',el.taskId)">
                    <div>
                        <div class="content-title">{{el.varsTitle.split("_")[0]}}
                            <span>发起的接待申请</span>
                        </div>
                        <div class="disc-text">
                            <div class="long-content">
                                <span class="disc-title long-title">部门名称</span>
                                <span class="long-text">{{el.officeName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">流程编号</span>
                                <span class="long-text">{{el.varsTitle.split("_")[3]}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">申请时间</span>
                                <span class="long-text">{{el.taskCreateTime}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">费用总额</span>
                                <span class="long-text">{{el.total | thousands(2)}}元</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">当前状态</span>
                                <span class="long-text font-orange">{{el.statusDesc}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">备注</span>
                                <span class="long-text">{{el.remark}}</span>
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <div class="add-btn mb-15" v-if="noApprloadmore">
                <span class="pointer" @click="noApprclickLoadMore()">加载更多</span>
            </div>
            <div class="prompt" v-if="noApprCount==0">
                <icon type="info" is-msg class="prompt-icon"></icon>
                <div class="mt-10">暂无数据</div>
            </div>
            <div class="fixed-btn">
                <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
            </div>
        </div>
        <div v-if="apprState==1">
            <!-- 我已审批 -->
            <group>
                <cell-box v-for="(el,index) in alrApprList" :key="index" @click.native="gotoApprovalDetail(el.businessId,'done',el.taskId)">
                    <div class="w-100">
                        <div class="content-title">{{el.varsTitle.split("_")[0]}}
                            <span>发起的接待申请</span>
                        </div>
                        <div class="disc-text">
                            <div class="long-content">
                                <span class="disc-title long-title">部门名称</span>
                                <span class="long-text">{{el.officeName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">流程编号</span>
                                <span class="long-text">{{el.varsTitle.split("_")[3]}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">申请时间</span>
                                <span class="long-text">{{el.taskCreateTime}}</span>
                            </div>
                            <div class="long-content">
                            <span class="disc-title long-title">费用总额</span>
                                <span class="long-text">{{el.total | thousands(2)}}元</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">流程状态</span>
                                <span class="long-text font-orange">{{el.statusDesc}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">备注</span>
                                <span class="long-text">{{el.remark}}</span>
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <div class="add-btn mb-15" v-if="loadmore">
                <span class="pointer" @click="clickLoadMore()">加载更多</span>
            </div>
            <div class="prompt" v-if="alrApprCount==0">
                <icon type="info" is-msg class="prompt-icon"></icon>
                <div class="mt-10">暂无数据</div>
            </div>
            <div class="fixed-btn">
                <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
            </div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showSearch" position="bottom" max-height="50%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="姓名" :max="50" v-model.trim="searchOpts.applyName" placeholder="请输入申请人姓名"></x-input>
                    <x-input title="流程编号" :max="50" v-model.trim="searchOpts.procCode" placeholder="请输入流程编号"></x-input>
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
    name: "ReceptionListRecived",
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
            noApprList: [],
            noApprCount: -1,
            alrApprList: [],
            alrApprCount: -1,
            apprState: 0,
            // loadmore: false,
            page: 1, //当前页数
            pageTotal: 1,
            pageSize: 10,

            noApprpage: 1, //当前页数
            noApprpageTotal: 1,
            noApprpageSize: 10,

            showSearch: false,
            // 搜索条件
            searchOpts: {
                applyName: "", // 申请人姓名
                procCode:'',
                officeName: "", // 流程编号
                applyTimeStart: "", // 开始时间
                applyTimeEnd: "", // 结束时间
                officeId: ""
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
        },
        noApprloadmore() {
            if (this.noApprpage >= this.noApprpageTotal) {
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
            this.noApprpage = 1;
            this.reset()
            this.getnoApprList();
        },
        //我未审批
        getnoApprList(opts) {
            var postData = {
                pageNo: 1,
                pageSize: this.noApprpageSize,
                billType: 4,
                ...this.axiosOpts,
                ...opts
            }; 
            com.covertHttp(api.getNoApprList, {
                ...postData,
                applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
                applyTimeEnd:com.timeParse(this.searchOpts.applyTimeEnd),
            }).then(rtn => {     
                this.noApprList = rtn.data.list;
                this.noApprCount = parseInt(rtn.data.total) || 0;
                this.noApprpageTotal = Math.ceil(this.noApprCount / this.noApprpageSize);
                this.showSearch = false;
            });       
        },
        //我已审批
        getAlrApprList(opts) {
            var postData = {
                pageNo: 1,
                pageSize: this.pageSize,
                billType: 4,
                ...this.axiosOpts,
                ...opts
            }; 
            com.covertHttp(api.getAlrApprList,{
                ...postData,
                applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
                applyTimeEnd:com.timeParse(this.searchOpts.applyTimeEnd),
                }).then(rtn => {
                this.alrApprList = rtn.data.list;
                this.alrApprCount = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.alrApprCount / this.pageSize);
                this.showSearch = false;
            }); 
        },
        //切换tab
        switchTabItem(index) {
            this.apprState = index;
            if (index == 1) {
                this.reset(); // 切换清空搜索条件
                this.getAlrApprList()
            } else {
                // this.getnoApprList();
                this.reset(); // 切换清空搜索条件
                this.init();
            }
        },
        gotoApprovalDetail(businessId, type, taskId) {
            if (businessId == "") return
            if (taskId == "") return
            this.$router.push({ path: "/reception/detail/" + businessId + "/" + type + "/" + taskId })
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                billType: 4,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.getAlrApprList,{
                ...postData,
                applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
                applyTimeEnd:com.timeParse(this.searchOpts.applyTimeEnd),
            }).then(rtn => {
                this.alrApprList.push(...rtn.data.list);
                this.alrApprCount = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.alrApprCount / this.pageSize);
            });   
        },
        noApprclickLoadMore(opts) {
            this.noApprpage++;
            var postData = {
                pageNo: this.noApprpage,
                pageSize: this.noApprpageSize,
                billType: 4,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.getNoApprList,{
                ...postData,
                applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
                applyTimeEnd:com.timeParse(this.searchOpts.applyTimeEnd),
            }).then(rtn => {
                this.noApprList.push(...rtn.data.list);
                this.noApprCount = parseInt(rtn.data.total) || 0;
                this.noApprpageTotal = Math.ceil(this.noApprCount / this.noApprpageSize);
            });
        },
        search() {
            if (this.searchOpts.applyTimeEnd != "" &&new Date(this.searchOpts.applyTimeEnd) <new Date(this.searchOpts.applyTimeStart)){
                this.$vux.toast.text("结束时间需大于开始时间");
                return;
            }
            this.axiosOpts = { ...this.searchOpts };
            // 搜索
            if(this.apprState == 0){
                this.getnoApprList();
            } else {
                this.getAlrApprList();
            }
            
        },
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        reset() {
            // 重置
            this.page = 1;
            this.noApprpage = 1;
            this.axiosOpts = {}
            this.searchOpts = {
                applyName: "",
                procCode:"",
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



