<template>
    <div v-if="isReady" class="approval_detail">
        <group title='基本信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">提交人</span>
                            <span class="long-detail">{{dataArr.detail.createByName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">部门</span>
                            <span class="long-detail">{{dataArr.detail.officeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">提交时间</span>
                            <span class="long-detail">{{dataArr.detail.createTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">当日电话拜访</span>
                            <span class="long-detail">{{dataArr.detail.custPhotoCount}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">当日上门拜访</span>
                            <span class="long-detail">{{dataArr.detail.custVisitCount}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">当日意向数量</span>
                            <span class="long-detail">{{dataArr.detail.custIntentionCount}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">当日签约数量</span>
                            <span class="long-detail">{{dataArr.detail.custSignCount}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">明日拜访数量</span>
                            <span class="long-detail">{{dataArr.detail.afterVisitCount}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">明日工作计划</span>
                            <span class="long-detail">{{dataArr.detail.afterDailyPlan}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataArr.detail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='客户情况'  v-if="count!==0">
            <cell-box v-for="(el,index) in listData" :key="index">
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">客户名称</span>
                            <span class="long-detail">{{el.custName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">拜访类型</span>
                            <span class="long-detail">{{el.visitTypeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">维护时间</span>
                            <span class="long-detail">{{el.custMaintenanceDate | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">维护内容</span>
                            <span class="long-detail">{{el.custMaintenanceContent}}</span>
                        </div>                    
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div>
        <group title='发送对象'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">发给谁</span>
                            <span class="long-detail">{{sendPeople}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import XHR from '@/assets/js/XHR';
import sinSelector from "@/components/sinSelector";
import { Box, Confirm, Group, XButton, Timeline, Selector, TimelineItem, Cell,ConfirmPlugin, CellBox, XTextarea, XInput, XDialog, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "LogMarketDetail",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Confirm,
        Group,
        Selector,
        XButton,
        Timeline,
        TimelineItem,
        Cell,
        CellBox,
        XTextarea,
        XInput,
        XDialog,
        Flexbox,
        FlexboxItem,
        sinSelector,
    },
    data() {
        return {
            isReady: false,
            listData: [],
            dataArr: {},
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            sendPeople:"",
        }
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
    },
    methods: {
        init() {
            if (!this.$route.params.id){
                console.log('参数异常');
                console.log(params);
                this.$router.push({ path: '/userIndex' });
                return
            }
            com.covertHttp(api.getMarketDailyById,{
                id: this.$route.params.id,
            }).then(rtn => {
                if (rtn.status != 0) {
                    // this.$vux.toast.text(rtn.message || "查询不到当前信息");
                    this.$router.push({ path: '/userIndex' });
                    return;
                }
                this.dataArr.detail = rtn.data;
                rtn.data.sendToList.forEach((item,index) => {
                    this.sendPeople += item.sendToName+" "
                })
                this.isReady = true;
            })
            this.getList()
        },
        getList(){
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
            };
            com.covertHttp(api.getDailyCustMaintenance, {
                ...postData,
                id: this.$route.params.id,
            }).then(rtn => {
                this.listData = rtn.data.list;
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...opts
            };
            com.covertHttp(api.getDailyCustMaintenance, {
                ...postData,
                id: this.$route.params.id,
            }).then(rtn => {
                this.listData.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },


    }
}
</script>
<style lang="less">
.approval_detail{
    .upload-img{
    width: 100px;
    height: 80px;
    padding: 0 120px 10px;
    }
    .upload-img img{
        width: 100%;
        height: 100%;
    }
}
.xdialog-group-textarea{
    .weui-textarea{
        text-align:left !important;
    }
}
</style>
