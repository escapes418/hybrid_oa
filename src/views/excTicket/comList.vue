<template>
    <div>
        <group  title='异常单' label-margin-right="1em">
            <cell v-for="(el,index)  in dataList" :key="index" title="*" @click.native="gotoExcList(el.companyCode)" is-link>
                <span slot="title">{{el.companyName}}<span >({{el.count}})</span></span>
            </cell>
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
            <popup v-model="showSearch" position="bottom" max-height="70%" :popup-style="{zIndex: 800}">
                <group gutter="20px" label-margin-right="1em">
                    <x-input title="公司名称" :max="50" v-model.trim="searchOpts.companyName" placeholder="请输入"></x-input>
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
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'
import XHR from '@/assets/js/XHR';
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput, Datetime,XButton,Popup,Box,Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
export default {
    name: "comList",
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
            dataList: [],
            count: -1,
            page: 1,
            pageTotal: 1,
            pageSize:20,

            showSearch:false,
            // 搜索条件
            searchOpts:{
                companyName:'', // 公司名称
            },
            // 发送请求实际字段
            axiosOpts: {},
            todayDate:com.timeFormat(new Date().getTime()),
        }
    },
    created() {
        this.init();
    },
    computed:{
        loadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        },
    },

    methods: {
        init() {
            this.page = 1;
            this.reset();
            this.getList();
        },
        //我未审批
        getList(opts) {
            var postData = {
                pageNo:0,
                pageSize:this.pageSize,
                ...this.axiosOpts, //筛选条件
                ...opts
            }
            com.covertHttp(api.abnormalOrderCountByCompanyCode,{
                ...postData,
            }).then(rtn => {
                if(rtn.status == 0){
                    this.dataList = rtn.data.list;
                    this.count = parseInt(rtn.data.total) || 0;
                    this.pageTotal = Math.ceil(this.count / this.pageSize);
                    this.showSearch = false;
                } else {
                    this.count = 0
                    // this.$vux.toast.text(rtn.message || "网络异常");
                }
                
            })
        },
        search() { // 搜索
            this.axiosOpts = { ...this.searchOpts };
            this.getList();
        },
        showSearchBox() {
            this.showSearch = !this.showSearch;
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo:parseInt(this.page - 1),
                pageSize:this.pageSize,
                ...this.axiosOpts, //筛选条件
                ...opts
            }
            com.covertHttp(api.abnormalOrderCountByCompanyCode,{
                ...postData,
            }).then(rtn => {
                if(rtn.status == 0){
                    this.dataList.push(...rtn.data.list);
                    this.count = parseInt(rtn.data.total) || 0;
                    this.pageTotal = Math.ceil(this.count / this.pageSize);
                } else {
                    this.count = 0;
                    // this.$vux.toast.text(rtn.message || "网络异常");
                }
            })
        },
        gotoExcList(id) {
            if (!id) return
            this.$router.push({ path: "/excTicket/excList/" + id });
        },
        reset() { // 重置搜索
            this.page = 1;
            this.page = 1;
            this.axiosOpts = {}
            this.searchOpts = {
                companyName:'', // 公司名称
            }
        }
    },
}



</script>
<style>
.fixed-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
</style>


