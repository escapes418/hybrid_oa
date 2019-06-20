<template>
    <div>
        <tab v-model="tabIndex" prevent-default @on-before-index-change="switchTabItem">
            <tab-item selected>我参与的</tab-item>
            <tab-item>我发起的</tab-item>
            <tab-item>全部</tab-item>
        </tab>
        <group v-if="count!==0">
            <cell-box v-for="(el,index) in listData" :key="index" @click.native="gotoDetail(el.id)">
                <div class="w-100">
                    <div class="detail-text">
                        <div class="content-title">{{el.initiator}}
                            <span>发起的需求协作</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">标题</span>
                            <span class="long-detail font-orange">{{el.title}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">进度状态</span>
                            <span class="long-detail">{{el.progressStatus}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">标签</span>
                            <span class="long-detail">{{el.label.join(',')}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">当前负责人</span>
                            <span class="long-detail">{{el.curPrincipal}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">状态变更时间</span>
                            <span class="long-detail">{{el.statusChangeTime | stamp2TextDateFull}}</span>
                        </div>                
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="fixed-btn">
            <x-button type="primary" class="smallbtn" :mini="true" @click.native="creatClue">新建</x-button>
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
            <popup v-model="showSearch" position="bottom" max-height="70%">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="标题/描述/状态" :max="50" v-model.trim="searchOpts.titleOrDescription" placeholder="请输入"></x-input>
                    <sinSelector sTitle='类型' sPlaceholder='请选择' :dataList="dictionary.actCategory" :sendData="searchOpts.type" :selectedItem.sync="searchOpts.type"></sinSelector>
                    <mulSelectors sTitle='标签' sPlaceholder='请选择' :dataList="dictionary.needLabel" :max="3" :sendData="searchOpts.label" :selectedItem.sync="searchOpts.label"></mulSelectors>
                    <sinSelector sTitle='提交人' sPlaceholder='请选择' :dataList="linkmanList" :sendData="searchOpts.initiator" :selectedItem.sync="searchOpts.initiator"></sinSelector>
                    <sinSelector sTitle='当前负责人' sPlaceholder='请选择' :dataList="linkmanList" :sendData="searchOpts.curPrincipal" :selectedItem.sync="searchOpts.curPrincipal"></sinSelector>
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
import mulSelectors from "@/components/mulSelectors";
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
    name: "CoopList",
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
        mulSelectors,
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
                curPrincipal: "",
                titleOrDescription: "",
                label: [],
                type: "",
                initiator: "",
            },
            projectList:[],
            axiosOpts: {},
            dictionary:{
                actCategory:[],
                needLabel: [],
                needTypeList: [],
            },
            linkmanList:[],
        };
    },
    created() {
        this.getList();
        com.addKeepAlive(this); //添加keep-alive
        this.queryNeedType();
        this.queryNeedLabel();
        this.getLinkmanInfo();
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
        queryNeedType() {
             com.covertHttp(api.queryNeedType,{}).then(rtn => {
                if(rtn.status == 0) {
                    rtn.data.forEach((item,index)=>{
                        this.dictionary.actCategory.push({
                            ...item,
                            key: item.id,
                            value: item.typeName
                        })
                    })
                }
            })
        },
        queryNeedLabel() {
            com.covertHttp(api.queryNeedLabel).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.dictionary.needLabel.push({
                        ...item,
                        value: item.labelName,
                        key: item.id,
                    });
                });
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
            com.covertHttp(api.queryNeedFlowList, {
                ...postData,
                tab: this.tabIndex +1,
            }).then(rtn => {
                this.listData = rtn.data.list;
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        getLinkmanInfo() {
            com.covertHttp(api.escortEmployee).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.linkmanList.push({
                        ...item,
                        value: item.name,
                        key: item.id,
                    });
                });
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
            com.covertHttp(api.queryNeedFlowList, {
                ...postData,
                tab: this.tabIndex +1,
            }).then(rtn => {
                this.listData.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        switchTabItem(index) {
            this.tabIndex = index;
            this.reset();
            this.getList();
        },
        // 跳转
        gotoDetail(id) {
            if (id == "") return;
            this.$router.push({ path: "/coop/detail/" + id });
        },
        creatClue(){
            this.$router.push({path:'/coop/apply'})
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
                curPrincipal: "",
                titleOrDescription: "",
                label: [],
                type: "",
                initiator: "",
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
</style>

