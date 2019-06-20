<template>
    <div class="sinselector">
        <group>
            <div class="selectbox"  @click="showPopup=true">
                <div class="stitle">{{sTitle}}<span class="srequired" v-if="isRequired">*</span></div>
                <div class="svalue">{{pValue}}</div>
                <div class="svalue" style="color:#999" v-if="!pValue">{{sPlaceholder}}</div>
            </div>
        </group>
        <div v-transfer-dom>
            <div class="search" v-if="showPopup">
                <search @on-submit="search" v-model="searchOpts.queryText" placeholder="请输入关键字"></search>
            </div>
            <popup v-model="showPopup" height="100%">
                <div class="popup1 checkcontent_sin">
                    <group v-if="listData.length!=0">
                        <cell-box v-for="(el,index) in listData" :key="index" @click.native="clickItem(index)">
                            <div class="w-100">
                                <div class="disc-text">
                                    <div class="long-content">
                                        <span class="disc-title long-title">合同编号</span>
                                        <span class="long-text font-orange">{{el.contractCode}}</span>
                                    </div>
                                    <div class="long-content">
                                        <span class="disc-title long-title">合同名称</span>
                                        <span class="long-text">{{el.contractName}}</span>
                                    </div>
                                    <div class="long-content">
                                        <span class="disc-title long-title">合同负责人</span>
                                        <span class="long-text">{{el.contractLeaderName}}</span>
                                    </div>
                                    <div class="long-content">
                                        <span class="disc-title long-title">法定代表人</span>
                                        <span class="long-text">{{el.legalRepresentative}}</span>
                                    </div>
                                </div>
                            </div>
                        </cell-box>
                    </group>
                    <div class="add-btn mb-15" v-if="loadMore">
                        <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
                    </div>
                    <div class="pointout" v-if="listData.length==0">
                        <icon type="info" is-msg class="pointout-icon"></icon>
                        <div class="mt-10">暂无数据</div>
                    </div>
                </div>
            </popup>
            <box class="schecklistbtn" v-if="showPopup">
                <flexbox>
                    <flexbox-item>
                        <x-button type="default" @click.native="showPopup = false">取消</x-button>
                    </flexbox-item>
                </flexbox>
            </box>
        </div>

    </div>
</template>

<script>
import api from '@/assets/api/index.api';
import com from "@/assets/js/common";
import {
    Popup,
    Checklist,
    Search,
    Box,
    XInput,
    Cell,
    CellBox,
    Icon,
    Group,
    XTextarea,
    XButton,
    Flexbox,
    FlexboxItem,
    TransferDomDirective as TransferDom
} from "vux";
import { setTimeout } from "timers";
export default {
    directives: {
        TransferDom
    },
    components: {
        Popup,
        Checklist,
        Box,
        Cell,
        CellBox,
        XInput,
        Icon,
        Search,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        XTextarea
    },
    props: {
        sTitle: String, //选择框的title
        sLabel: [String, Boolean, Number, Array],
        sPlaceholder: String, //Placeholder
        sendData: [String, Boolean, Number], //选中的值
        dataList: Array, //传入的数组，格式必须为[{value:"", key:"",}]
        isRequired: Boolean,
    },
    data() {
        return {
            showPopup: false,
            sValue: "",
            selectedItem: [], 
            listData: [],  
            pValue:"",
            pageNo: 1, 
            pageTotal: 1,
            pageSize: 10, 
            count:-1,
            searchOpts: {
                queryText: "", // 
            },
        };
    },
    created() {
        if(this.sLabel){
            this.pValue = this.sLabel;
        } else {
            this.pValue = "";
        }
        this.getList()
    },
    watch: {
    },
    computed: {
        loadMore() {
            if (this.pageNo >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        }
    },
    mounted() {
    },
    methods: {

        cancel() {
            this.showPopup = false;
        },
        search() {
            this.axiosOpts = { ...this.searchOpts };
            this.getList();
        },
        async getList(opts) {
            await com.debounce(500);//防抖
            var postData = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.queryMainContractList,{
                ...postData
            }).then(res => {
                this.listData = res.data.list || [];
                this.count = parseInt(res.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        clickLoadMore(opts) {
            this.pageNo = this.pageNo + 1;
            var postData = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                ...this.axiosOpts,
                ...opts
            };
            com.covertHttp(api.queryMainContractList,{
                ...postData
            }).then(res => {
                this.listData.push(...res.data.list);
                this.count = parseInt(res.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        clickItem(idx) {
            this.pValue = this.listData[idx].contractName;
            this.showPopup = false;
            this.$emit("selectedItem", this.listData[idx]);
        },
    }
};
</script>

<style lang="less">
.sinselector {
    .weui-cells {
        margin-top: 0 !important;
    }
    .vux-no-group-title {
        margin-top: 0 !important;
    }
    .weui-cells:before {
        left: 15px !important;
    }
    .weui-cells:after {
        border-bottom: none !important;
    }
    .weui-textarea {
        text-align: right !important;
    }
}
.schecklistbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10000;
    background: #eee;
}
.popup1 {
    padding-bottom: 62px;
}
.search {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10000;
    background: #eee;
}
.checkcontent_sin {
    margin-top: 43px;
}
.selectbox{
    display: flex;
    height: 24px;
    padding: 10px 15px;
    font-size: 17px;
    .stitle{
        height: 24px;
        position: relative;
        padding-right:2px; 
        .srequired{
            position: absolute;
            left: -8px;
            color: red;
        }
    }
    .svalue{
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 24px;
        width: 100%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
}
.pointout .pointout-icon{
    padding-top:150px;
    display: block;
    text-align: center;
    background: #eee;
}
.pointout div{
    background: #eee;
    padding-top:20px;
    text-align: center;
    border: 1px solid #eee;
}
</style>
