<template>
    <div>
        <div class="cusList">
            <group title='实施状态标记'>
                <cell-box v-for="(el,index)  in empList" :key="index" class="maintainbox">
                    <div>
                        <div class="disc-text empList">
                            <div class="long-content">
                                <span class="disc-title long-title">人员状态</span>
                                <span class="long-text font-orange">{{el.statusTxt}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">项目名称</span>
                                <span class="long-text">{{el.projectName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">人员动作</span>
                                <span class="long-text">{{el.userActionTxt}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">地点节点</span>
                                <span class="long-text">{{el.projectNodeName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">待命基地</span>
                                <span class="long-text">{{el.baseName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">备注</span>
                                <span class="long-text">{{el.remarks}}</span>
                            </div>
                            <div class="long-content">
                                <span class="disc-title long-title">提交时间</span>
                                <span class="long-text">{{el.createTime|stamp2TextDateFull}}</span>
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <div class="add-btn mb-15" v-if="isloadmore">
                <span class="pointer" @click="loadMore()">加载更多</span>
            </div>
            <div class="prompt" v-if="listCount==0">
                <icon type="info" is-msg class="prompt-icon"></icon>
                <div class="mt-10">暂无数据</div>
            </div>
        </div>
        <box class="fixbtn">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="goApply">新建</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <!-- <div v-transfer-dom>
            <popup v-model="showSearch" position="bottom" max-height="50%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="客户名称" v-model="searchOpts.custInfoName" placeholder="请输入客户名称"></x-input>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.startTime" class="data-time" title="开始时间" :end-date="todayDate" placeholder="请选择申请开始时间"></datetime>
                    <datetime format="YYYY-MM-DD" v-model="searchOpts.endTime" class="data-time" title="结束时间" :end-date="todayDate" placeholder="请选择申请结束时间"></datetime>
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
        </div> -->
    </div>
</template>
<script>
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'
import XHR from '@/assets/js/XHR';
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput, Datetime,XButton,Popup,Box,Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
export default {
    name: "EmpStatusList",
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
    data: function () {
        return {
            results: [],
            empList: [],
            listCount: -1,
            
            // listType: this.$route.params.type,
            // conflict: this.$route.params.search,
            page: 1,//当前页数
            pageTotal:1,
            pageSize:10,

            // showSearch:false,
            // 搜索条件
            // searchOpts:{
            //     custInfoName:'', // 客户名称
            //     startTime:'', // 开始时间
            //     endTime:'', // 结束时间
            // },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate:com.timeFormat(new Date().getTime()),
        }
    },
    created() {
        // this.getList();
        this.init();
        // com.addKeepAlive(this) //添加keep-alive
    },
    computed:{
        isloadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        }
    },

    methods: {
        init() {
            this.page = 1;
            // this.reset();
            this.getList({});
        },
        getList(opts) {
            var postData = {
                pageNo:1,
                pageSize:this.pageSize,
                ...opts
            }
            com.covertHttp(api.findEmployeeStatusList,{
                ...postData,
                }).then(rtn => {
                this.empList = rtn.data.list;
                this.listCount = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.listCount / this.pageSize);
                // this.showSearch = false;
            })
        },
        goApply(){
            if(this.empList.length == 0){
                var type = 0
            } else {
                var type = this.empList[0].userAction;
            }
            this.$router.push({ path: `/empStatus/apply/${type}`});
        },
        // search() { // 搜索
        //     if(this.searchOpts.endTime != '' && com.timeParse(this.searchOpts.endTime) < com.timeParse(this.searchOpts.startTime)) {
        //         this.$vux.toast.text("结束时间需大于开始时间");
        //         return;
        //     }
        //     this.axiosOpts = { ...this.searchOpts };
        //     this.getList({});  
        // },
        // showSearchBox() {
        //     this.showSearch = !this.showSearch;
        // },
        loadMore(opts) {
            this.page++;
            var postData = {
                pageNo:this.page,
                pageSize:this.pageSize,
                // ...this.axiosOpts,
                ...opts
            }
            com.covertHttp(api.findEmployeeStatusList,{
                ...postData,
            }).then(rtn => {
                this.empList.push(...rtn.data.list);
                this.listCount = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.listCount / this.pageSize);
            })
        },
        // reset() { // 重置搜索
        //     this.page = 1;
        //     this.axiosOpts = {}
        //     this.searchOpts = {
        //         custInfoName:'', // 客户名称
        //         startTime:'', // 开始时间
        //         endTime:'', // 结束时间
        //     }
        // }
    },
}



</script>
<style>
.cusList{
    margin-bottom: 68px;
}
 .empList .long-text {
    margin-left:5.5em;
}
.fixbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    background: #f0f0f2;
}
</style>


